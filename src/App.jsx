import React, { useRef, useState } from 'react';
import { useBoardState } from './hooks/useBoardState';
import { Toolbar } from './components/Toolbar';
import { Viewport } from './components/Viewport';
import { Canvas } from './components/Canvas';
import { PersonCard } from './components/PersonCard';
import { ConnectionLines } from './components/ConnectionLines';
import { RelationModal } from './components/RelationModal';
import { HelpModal } from './components/HelpModal';

function App() {
  const {
    cards,
    links,
    connectingFrom,
    statusText,
    showStatus,
    addCard,
    updateCard,
    deleteCard,
    startConnection,
    setConnectingFrom,
    addLink,
    updateLink,
    deleteLink,
    loadData
  } = useBoardState();

  const viewportRef = useRef({ x: 0, y: 0, scale: 1 });
  const [transform, setTransform] = useState(viewportRef.current);
  const canvasRef = useRef(null);

  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create', // 'create' | 'edit'
    linkId: null,
    pendingTargetId: null
  });

  const [helpOpen, setHelpOpen] = useState(false);

  const handleCardClick = (id) => {
    if (connectingFrom && connectingFrom !== id) {
      setModalState({
        isOpen: true,
        mode: 'create',
        linkId: null,
        pendingTargetId: id
      });
    }
  };

  const openEditModal = (linkId) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      linkId,
      pendingTargetId: null
    });
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
    setConnectingFrom(null);
    showStatus('');
  };

  const handleModalSave = (label, color) => {
    if (modalState.mode === 'create') {
      addLink(connectingFrom, modalState.pendingTargetId, label, color);
    } else if (modalState.mode === 'edit') {
      updateLink(modalState.linkId, { label, color });
    }
    closeModal();
  };

  const handleModalDelete = (linkId) => {
    deleteLink(linkId);
    closeModal();
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#f0f0f0] font-sans">
      <Toolbar 
        addCard={addCard}
        cards={cards}
        links={links}
        loadData={loadData}
        showStatus={showStatus}
        statusText={statusText}
        viewportRef={viewportRef}
        onHelpClick={() => setHelpOpen(true)}
      />
      
      <Viewport viewportRef={viewportRef} transform={transform} setTransform={setTransform}>
        <Canvas ref={canvasRef} transform={transform}>
          <ConnectionLines 
            links={links} 
            cards={cards} 
            openModal={openEditModal} 
          />
          
          {Object.values(cards).map(card => (
            <PersonCard 
              key={card.id}
              card={card}
              viewportRef={viewportRef}
              updateCard={updateCard}
              deleteCard={deleteCard}
              startConnection={startConnection}
              isConnectingMode={connectingFrom === card.id}
              onCardClick={connectingFrom && connectingFrom !== card.id ? () => handleCardClick(card.id) : null}
            />
          ))}
        </Canvas>
      </Viewport>

      <RelationModal 
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        linkId={modalState.linkId}
        linkData={modalState.linkId ? links.find(l => l.id === modalState.linkId) : null}
        onClose={closeModal}
        onSave={handleModalSave}
        onDelete={handleModalDelete}
      />

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

export default App;
