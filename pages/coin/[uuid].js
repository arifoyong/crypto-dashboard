import { useRouter } from 'next/router'
import Layout from '../../components/Layout/Layout'

export default function CoinDetail() {
  const router = useRouter()
  const {uuid} = router.query
  return (
    <Layout>
      {uuid}
    </Layout>
  )
}