import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

const jwtAtom = atom(() => localStorage.getItem('jwt') || null);

export function useJwt() {
  const [jwt, setJwtAtom] = useAtom(jwtAtom);

  // Automatically hydrate the jwt from localStorage on load
  useEffect(() => {
    const storedJwt = localStorage.getItem('jwt');
    if (storedJwt && !jwt) {
      setJwtAtom(storedJwt);
    }
  }, []);

  const setJwt = (newJwt) => {
    localStorage.setItem('jwt', newJwt);
    setJwtAtom(newJwt);
  };

  const getJwt = () => localStorage.getItem('jwt');

  const clearJwt = () => {
    localStorage.removeItem('jwt');
    setJwtAtom(null);
  };

  return { jwt, setJwt, getJwt, clearJwt };
}
