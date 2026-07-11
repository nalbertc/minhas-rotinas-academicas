import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { ChevronLeft, Pencil } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Alert, Image, Text as TextComp, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { Input } from "../components/Input";
import { Text } from "../components/Text";
import { useProfile } from "../hooks/useprofile";
import { supabase } from "../libs/supabase";
import { getInitials } from "./ProfileScreen";

export function EditarPerfilScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme()
  const navigation = useNavigation()
  const { profile } = useProfile()

  const [nome, setNome] = useState(profile?.nome)
  const [image, setImage] = useState(profile?.imageUrl);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita acesso às imagens'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled)
      return;

    setImage(result.assets[0].uri);
  }

  async function handleSave() {
    try {
      setLoading(true);

      let imageUrl = profile?.imageUrl;

      const changedImage = !!image && image !== profile?.imageUrl;
      // 1 Upload primeiro
      if (changedImage) {
        const response = await fetch(image);
        if (!response.ok) {
          throw new Error('Falha ao ler imagem');
        }

        const file = await response.arrayBuffer();

        const extension =
          image
            .split('.')
            .pop()
            ?.toLowerCase() ||
          'jpg';

        const fileName =
          `${profile?.id}-${Date.now()}.${extension}`;

        const {
          data:
          uploadData,
          error:
          uploadError,
        } =
          await supabase
            .storage
            .from('avatars')
            .upload(fileName, file, {
              contentType: `image/${extension}`,
              upsert: true,
            }
            );

        if (uploadError) {
          Alert.alert(
            'Erro',
            'Falha ao enviar imagem'
          );

          return;
        }

        const { data: publicData, } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(fileName);

        imageUrl = publicData.publicUrl;
      }

      const { data, error, } =
        await supabase
          .from('user')
          .update({
            nome,
            imageUrl,
          })
          .eq('id', profile?.id)
          .select()
          .single();

      if (error) {
        console.log(error);
        Alert.alert(
          'Erro',
          'Falha ao atualizar'
        );

        return;
      }

      Alert.alert(
        'Sucesso',
        'Perfil atualizado'
      );

    } catch (error) {
      console.log(error);
      Alert.alert(
        'Erro',
        'Algo deu errado'
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1  dark:bg-backgroundDark bg-backgroundLight" style={{ paddingTop: insets.top }} >


      <View className="h-16 w-full items-center justify-between px-4 flex-row">
        <View className="w-1/6 items-start" >
          <TouchableOpacity className="relative rounded-lg" activeOpacity={0.7} onPress={() => navigation.goBack()}>
            <ChevronLeft color={colorScheme === "dark" ? "white" : "black"} />

          </TouchableOpacity>
        </View>

        <Heading >
          Editar perfil
        </Heading>
        <View className="w-1/6 " />
      </View>

      <View className="px-4 flex-1 gap-6">
        <View className="items-center">
          <View className="bg-primary/60 w-48 h-48 rounded-full relative border border-primary">
            {image ?
              <Image source={{
                uri: image
              }} className="flex-1 rounded-full" /> : <View className="items-center justify-center flex-1">
                <TextComp className="text-white font-medium text-6xl">{getInitials(profile?.nome ?? "")}</TextComp>
              </View>
            }

            <TouchableOpacity className='bg-primary right-0  items-center  justify-center rounded-full w-14 h-14 absolute bottom-0 border border-gray-300' onPress={pickImage} activeOpacity={0.7}>
              <Pencil color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="gap-4">
          <View className="gap-2">
            <Text>Nome completo</Text>
            <Input value={nome}
              onChangeText={setNome}
            />
          </View>

          <View className="gap-2">
            <Text>E-mail</Text>

            <Input value={profile?.email} editable={false} />
          </View>
        </View>

      </View>

      <View className="px-6 mb-10">
        {image !== profile?.imageUrl || nome !== profile?.nome ?
          <Button onPress={handleSave}>Salvar alterações</Button>
          :
          <></>
        }
      </View>
    </View>
  )
}