import { formatCurrency, formatSubscriptionDateTime } from '@/lib/utils'
import clsx from 'clsx'
import { View, Text, Image, Pressable } from 'react-native'

const SubscriptionCard = ({ name, price, currency, icon, billing, color, category,
    plan, renewalDate, expanded,  onPress } : SubscriptionCardProps) => {
  return (
    <Pressable onPress={onPress} className={clsx('sub-card', expanded ? 
    'sub-card-expanded' : 'bg-card')} style = {! expanded && color ? {backgroundColor : color} : undefined}>
      <View className='sub-head'>
        <View className='sub-main'>
            <Image source={icon} className='sub-icon' style={{width : 38, height : 38}}/>
            <View className='sub-copy'>
                <Text numberOfLines={1} className='sub-title'>
                    {name}
                </Text>
                <Text numberOfLines={1} ellipsizeMode='tail' className='sub-meta'>
                    {category?.trim() || plan?.trim() || (renewalDate ? formatSubscriptionDateTime(renewalDate): '')}
                </Text>
            </View>
        </View>

        <View className='sub-price-box'>
            <Text className='sub-price'>{formatCurrency(price, currency)}</Text >
            <Text className='sub-billing'>{billing}</Text >
        </View>
      </View>

      {expanded && (
    <View className='sub-expanded'>
        <Text className='sub-expanded-text'>Subscription details go here ...</Text>
    </View>
    )}
    </Pressable>
  )
}

export default SubscriptionCard