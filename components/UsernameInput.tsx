import styles from 'styles/components/username-input.module.scss'

const { input_container, title, username_input } = styles

// type UsernameInputProps = {
//   text: string
// }

const UsernameInput = () => {
  return (
    <div className={input_container}>
      <div className={title}>Username</div>
      <input type="text" className={username_input}></input>
    </div>
  )
}

export default UsernameInput
