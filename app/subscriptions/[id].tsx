import { View, Text } from 'react-native'
import { Link,useLocalSearchParams } from 'expo-router'

const SubscriptionDetails = () => {
    const {id} = useLocalSearchParams<{id : string}>();
  return (
    <View>
      <Text>SubscriptionDetails : {id}</Text>
      <Link href="/">Go Back</Link>
    </View>
  )
}

export default SubscriptionDetails