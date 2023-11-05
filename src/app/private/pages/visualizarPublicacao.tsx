import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { IPublicacao } from "../../interfaces/forum.interface";
import { IUser } from "../../interfaces/user.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PublicacaoVisualizar from "../../components/PublicacaoVisualizar";
import BackButton from "../../components/BackButton";

export default function VisualizarPublicacao() {
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const item = useLocalSearchParams() as unknown as IPublicacao & IUser;

  const getIdUsuario = () => {
    AsyncStorage.getItem("usuario").then((response) => {
      const usuario = JSON.parse(response as string) as IUser;
      setIdUsuario(usuario?.id);
    });
  };

  const navigate = () => {
    router.push({
      pathname: "/private/pages/editarPublicacao",
      params: item,
    });
  };

  useEffect(() => getIdUsuario());

  return (
    <View>
      <View style={styles.header}>
        <BackButton route="private/tabs/forum" />

        <Text style={styles.tituloheader}>Visualizar Publicação</Text>
      </View>

      <ScrollView>
        <PublicacaoVisualizar item={item} />

        {idUsuario && item.idUsuario == idUsuario && (
          <Pressable onPress={navigate} style={styles.editar}>
            <Text style={styles.textoEditar}>Editar</Text>
            <Icon name="pencil" size={20} color={"white"} />
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2CCDB5",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  tituloheader: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editar: {
    backgroundColor: "#2CCDB5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    width: 200,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  textoEditar: {
    color: "white",
    fontSize: 18,
    margin: 5,
  },
  botaoResponder: {
    backgroundColor: "#B4026D",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginRight: 15,
    marginLeft: 15,
    marginTop: 5,
    borderRadius: 12,
    width: "auto",
    right: 0,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  resposta: {
    fontWeight: "bold",
    color: "black",
    fontSize: 24,
    padding: 20,
  },
});
