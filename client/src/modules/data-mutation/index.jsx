import { useMutation } from '@apollo/react-hooks'

export default ({ mutation, fetchPolicy = 'network-only', children }) => {
  const [
    executeMutation,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(mutation, { fetchPolicy })
  return children({ executeMutation, mutationLoading, mutationError })
}
