import { useMutation } from '@apollo/react-hooks'

export default ({ mutation, children }) => {
  const [executeMutation, { loading: mutationLoading, error: mutationError }] = useMutation(
    mutation
  )
  return children({ executeMutation, mutationLoading, mutationError })
}
