import Bridge from '../components/Bridge'

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">RupX Cross-Chain Bridge</h1>
      <Bridge />
    </div>
  )
}