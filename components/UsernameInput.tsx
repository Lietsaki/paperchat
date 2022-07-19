import styles from 'styles/components/username-input.module.scss'

const { input_container, title, username_input, make_complete_rectangle } =
  styles

type UsernameInputProps = {
  editing: boolean
}

const UsernameInput = ({ editing }: UsernameInputProps) => {
  const shouldBeCompleteRectangle = () =>
    editing ? make_complete_rectangle : ''

  return (
    <div className={`${input_container} ${shouldBeCompleteRectangle()}`}>
      <div className={title}>Username</div>
      <input type="text" className={username_input}></input>
    </div>
  )
}

export default UsernameInput
