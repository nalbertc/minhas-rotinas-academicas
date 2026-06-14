import { Text, View } from 'react-native';
import { Button } from '../components/Button';
import { supabase } from '../libs/supabase';


export function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#1C1C27]">
      <Text className="text-xl font-bold text-blue-500">
        Profile
      </Text>

      <View className='w-full gap-4'>


        <Button type='secondary' onPress={async () => {
          // await supabase.auth.signOut()
        }}>Sair</Button>
        <Button type='primary' onPress={async () => {
          await supabase.auth.signOut()
        }}>Sair</Button>

      </View>

      <Button />
    </View>
  );
}


