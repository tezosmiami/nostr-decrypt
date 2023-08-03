import { useEffect, useState, createContext, useContext } from "react"
// import { useNostr, dateToUnix, useNostrEvents } from "nostr-react"
import { useSubscribe } from 'nostr-hooks';

const NostrContext = createContext();

const relayUrls = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social'
];

export const useNostrContext = () => {
  const nostr = useContext(NostrContext);
  if (!nostr) {
    throw new Error(
      `!nostr`
    );
  }
  return nostr;
};

let nip07 = 'nostr' in window
const NostrContextProvider = ({ children }) => {
  const [pub, setPub] = useState(localStorage.getItem('pub'))
  useEffect(() => {
    const getPub = async () => {
        console.log('hi')
      let pubkey = await window.nostr.getPublicKey()
      localStorage.setItem('pub', pubkey)
      setPub(pubkey)       
    }

      !pub && nip07 && getPub()
  }, [nip07])

  const { events: received } = useSubscribe({
    relays: relayUrls,
    filters: [{
      kinds: [4],
      "#p": [pub],
    }],
  })

  const { events: sent } = useSubscribe({
    relays: relayUrls,
    filters: [{

      kinds: [4],
      authors: [
        pub
      ],
    }],
  })
  console.log('sent', sent)
  const wrapped = { pub, sent, received }

  return (
    <NostrContext.Provider value={wrapped}>
      {children}
    </NostrContext.Provider>
  );
};

export default NostrContextProvider;