import { X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { Heading } from './Heading';

interface ModalProps {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  isModalVisible: boolean,
  showClose?: boolean
  title: string
  children: ReactNode
}

export function ModalComponent({ isModalVisible, showClose, setModalVisible, children, title }: ModalProps) {

  const { colorScheme } = useColorScheme()



  return (
    <View style={{ flex: 1 }} >
      <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1 }} className='justify-center items-center '>
          <View className='bg-white dark:bg-cardDark p-5 rounded-3xl w-[95%] relative gap-4'>

            {showClose && <TouchableOpacity className='absolute right-5 top-5 bg-red-500/20 p-1 rounded-md z-10' onPress={() => setModalVisible(false)}>
              <X color={colorScheme === "dark" ? "#fff" : "#000"} />
            </TouchableOpacity>}

            <Heading size='sm'>{title}</Heading>

            <View>
              {children}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}