import { ReactNode, useState } from 'react';

import {
  Button,
  Menu,
} from 'react-native-paper';


interface SelectProps {
  anchor: ReactNode
}

export function Select({ anchor }: SelectProps) {

  const [visible, setVisible,] = useState(false);
  const [value, setValue,] = useState('');

  return (

    <Menu visible={visible}
      onDismiss={() =>
        setVisible(false)
      }

      anchor={

        <Button

          mode="outlined"

          onPress={() =>
            setVisible(
              true
            )
          }
        >

          {
            value ||
            'Tipo'
          }

        </Button>
      }
    >
      <Menu.Item title="Prova"
        onPress={() => {
          setValue('Prova');
          setVisible(false);
        }}
      />

      <Menu.Item title="Projeto"
        onPress={() => {
          setValue('Projeto');
          setVisible(false);
        }}
      />

    </Menu>

  );
}