import NostrContextProvider from './context'
import { Messages } from './messages'
import './App.css'


export default function App() {
  return (
    <NostrContextProvider>
      <Messages />
    </NostrContextProvider>
  )
}
