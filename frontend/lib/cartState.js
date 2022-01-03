import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // CUstom provider, we store data here and anyone can access via the cosumer
  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }
  return (
    <LocalStateProvider
      value={{
        cartOpen,
        setCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </LocalStateProvider>
  );
}

// make custom hook to access cart local state
function useCart() {
  // we use a consumer here to access local state
  const all = useContext(LocalStateContext);
  return all;
}
export { CartStateProvider, useCart };
