import RichTextEditor from './editor/v2/Editor'

function App() {
  return <>
    <div className="h-screen  w-screen">
      <div className='w-full h-9/12 flex flex-row justify-center'>
        <div>
          <RichTextEditor />
        </div>
      </div>
    </div>

  </>
}

export default App
