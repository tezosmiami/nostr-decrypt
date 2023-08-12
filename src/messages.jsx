import React, { useEffect, useState, useRef } from 'react'
import { useNostrContext } from './context'

class PromiseQueue {
  queue = Promise.resolve(true)

  add(operation) {
    return new Promise((resolve, reject) => {
      this.queue = this.queue
        .then(operation)
        .then(resolve)
        .catch(reject)
    })
  }
}

export const Messages = () => {
  const [decrypted, setDecrypted] = useState([])
  // const [pub, setPub] = useState('')
  const { sent, received, pub } = useNostrContext()
  //const queue = new PQueue({ concurrency: 1 });
  const queueRef = useRef(new PromiseQueue());
  
  const groupBy = (arr) => {
    return arr.reduce((acc, cur) => {
      let property = cur.pubkey === pub ? 'tags' : 'pubkey'
      acc[property === 'tags' ? cur[property][0][1] : cur[property]] = [...acc[property === 'tags' ? cur[property][0][1] : cur[property]] || [], cur];
      return acc;
    }, {});
  }

  const decryptMessage = async (event) => {
    let senderDecode = event.pubkey === pub
      ? event.tags[0][1] : event.pubkey
    //   let decoded = await window.nostr.nip04.decrypt(senderDecode, event.content)
    let decoded
    try {
      decoded = await queueRef.current.add(async () => { 
        return await window.nostr.nip04.decrypt(senderDecode, event.content) 
      })
    } catch (e) { console.error(e) }

    // await queue.add(async() => await window.nostr.nip04.decrypt(senderDecode, event.content))

    return decoded
  }

  // useEffect(() => {
  //     const decodeSent = async () =>{ 
  //         const event = sent[sent.length-1]
  //         if (event) {
  //             // event.decoded = await decryptMessage(event)
  //             event.decoded = await decryptMessage(event)
  //             // event.decoded = await queue.add(decoded)
  //             sent[sent.length-1] = event
  //             setDecrypted((d) => [...d, event])
  //         }
  //     }
  //     decodeSent()
  // }, [sent])

  useEffect(() => {
    const decodeReceived = async () => {
      const event = received[received.length - 1]
      if (event) {
        console.log('de1', event)
        event.decoded = await decryptMessage(event)
        // event.decoded = await queue.add(decoded)
        // setTimeout(async () => {
        //     try{
        //     let decoded = await queue.add(async () => {return await decryptMessage(event)})
        //     console.log(decoded)
        //     event.decoded = decoded
        //     } catch (e) {console.log(e)}
        // },  Math.random()*100);
        received[received.length - 1] = event
        setDecrypted((d) => [...d, event])
        // active = false
      }
    }
    decodeReceived()
  }, [received])


  const messages = [...sent, ...received].reverse()
  console.log(messages)
  console.log('de', decrypted)
  console.log('pub', pub)
  return (
    < div style={{ top: '81px', position: 'relative', zIndex: '111' }
    }>
      {pub && <div>connected: {pub}</div>}
      {Object.entries(groupBy(messages)).map((m, i) =>
        <div key={m[0]}>{m[1][m[1].length - 1].decoded} </div>)}

    </div >
  )
}    