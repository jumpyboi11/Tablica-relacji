import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useBoardState() {
  const [cards, setCards] = useState({});
  const [links, setLinks] = useState([]);
  
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [statusText, setStatusText] = useState('');
  
  const statusTimeoutRef = useRef(null);

  const showStatus = useCallback((text, timeout = 0) => {
    setStatusText(text);
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    if (timeout > 0) {
      statusTimeoutRef.current = setTimeout(() => {
        setStatusText((prev) => (prev === text ? '' : prev));
      }, timeout);
    }
  }, []);

  const addCard = useCallback((viewport) => {
    const id = `card-${uuidv4()}`;
    const x = (-viewport.x + window.innerWidth / 2) / viewport.scale - 100;
    const y = (-viewport.y + window.innerHeight / 2) / viewport.scale - 120;
    
    setCards((prev) => ({
      ...prev,
      [id]: {
        id,
        x,
        y,
        name: '',
        desc: '',
        avatarBg: '',
        width: '200px',
        height: '',
        headerColor: '#333333',
      },
    }));
  }, []);

  const updateCard = useCallback((id, updates) => {
    setCards((prev) => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], ...updates },
      };
    });
  }, []);

  const deleteCard = useCallback((id) => {
    setCards((prev) => {
      const newCards = { ...prev };
      delete newCards[id];
      return newCards;
    });
    setLinks((prev) => prev.filter((link) => link.from !== id && link.to !== id));
    setConnectingFrom((prev) => (prev === id ? null : prev));
  }, []);

  const startConnection = useCallback((id) => {
    if (connectingFrom === id) {
      setConnectingFrom(null);
      showStatus('');
    } else {
      setConnectingFrom(id);
      showStatus('Wybierz drugą osobę do połączenia...');
    }
  }, [connectingFrom, showStatus]);

  const addLink = useCallback((from, to, label = 'Relacja', color = '#333333') => {
    setLinks((prev) => [
      ...prev,
      { id: `link-${uuidv4()}`, from, to, label, color },
    ]);
  }, []);

  const updateLink = useCallback((id, updates) => {
    setLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, ...updates } : link))
    );
  }, []);

  const deleteLink = useCallback((id) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  }, []);

  const loadData = useCallback((data) => {
    setCards(data.cards || {});
    setLinks(data.links || []);
    setConnectingFrom(null);
  }, []);

  return {
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
    loadData,
  };
}
