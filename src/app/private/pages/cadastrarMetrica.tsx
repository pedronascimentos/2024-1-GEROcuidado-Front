import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { IUser } from "../../interfaces/user.interface";
import { IIdoso } from "../../interfaces/idoso.interface";
import { router } from "expo-router";
import { postMetrica } from "../../services/metrica.service";
import { EMetricas, IMetrica } from "../../interfaces/metricas.interface";
import Toast from "react-native-toast-message";
import { hasFoto} from "../../shared/helpers/foto.helper";
import { getFoto } from "../../shared/helpers/photo.helper";

export default function criarMetrica() {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [idoso, setIdoso] = useState<IIdoso | undefined>(undefined); 
  const [token, setToken] = useState<string>("");
  const [showLoading, setShowLoading] = useState(false);

  // Função assíncrona para carregar o token do AsyncStorage
  const getToken = async () => {
    try {
      const response = await AsyncStorage.getItem("token");
      if (response) setToken(response as string);
    } catch (error) {
      console.error("Erro ao carregar o token:", error);
    }
  };

  // Função assíncrona para carregar o usuário do AsyncStorage
  const handleUser = async () => {
    try {
      const response = await AsyncStorage.getItem("usuario");
      if (response) {
        const usuario = JSON.parse(response as string);
        setUser(usuario);
      }
    } catch (error) {
      console.error("Erro ao carregar o usuário:", error);
    }
  };

  // Função assíncrona para carregar o idoso do AsyncStorage
  const getIdoso = async () => {
    try {
      const idosoString = await AsyncStorage.getItem("idoso");
      if (idosoString) {
        const idosoPayload = JSON.parse(idosoString) as IIdoso;
        setIdoso(idosoPayload);
      }
    } catch (error) {
      console.error("Erro ao carregar o idoso:", error);
    }
  };

  // Função para lidar com a seleção da métrica
  const handleMetricSelection = async (metricType: EMetricas) => {
    // Verificando se o idoso está carregado antes de prosseguir
    if (!idoso) {
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: "Idoso não encontrado. Por favor, tente novamente mais tarde.",
      });
      return; // Se o idoso não estiver disponível, retornamos e não continuamos a execução
    }

    const body = {
      idIdoso: Number(idoso.id), // Garante que o idoso existe
      categoria: metricType,
    };

    try {
      setShowLoading(true);
      const response = await postMetrica(body, token);
      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: response.message as string,
      });

      // Redirecionando para a tela de registros após o sucesso
      router.replace({
        pathname: "private/tabs/registros",
      });
    } catch (err) {
      const error = err as { message: string };
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: error.message,
      });
    } finally {
      setShowLoading(false);
    }
  };

  // Função para retornar à tela anterior
  const back = () => {
    router.push({
      pathname: "private/tabs/registros",
    });
  };

  // Função para renderizar o cartão da métrica
  const renderMetricCard = (
    metricType: EMetricas,
    iconName: string,
    description: string,
    iconColor: string,
  ) => (
    <Pressable
      key={metricType}
      style={styles.metricCard}
      onPress={() => handleMetricSelection(metricType)}
      testID={`${metricType}-card`}
    >
      <View style={styles.metricCardContent}>
        {iconName === "oxygen" && <Text style={styles.oxygenSymbol}>O2</Text>}
        {iconName !== "oxygen" && (
          <Icon
            name={iconName}
            color={iconColor}
            size={30}
            style={styles.metricCardIcon}
          />
        )}
        <View style={styles.metricsName}>
          <Text style={styles.metricCardText}>{description}</Text>
          <Text style={styles.cadastrarPlaceholder}>
            Cadastrar {description}
          </Text>
        </View>
        <Icon name="chevron-right" color={"#888"} />
      </View>
    </Pressable>
  );

  // Carregamento de dados ao iniciar - Agora usando Promise.all para otimizar
  useEffect(() => {
    // Usando Promise.all para carregar todos os dados simultaneamente
    Promise.all([getToken(), handleUser(), getIdoso()])
      .catch((err) => console.error("Erro ao carregar dados iniciais:", err));
  }, []); // Esse efeito será executado uma vez, ao montar o componente.


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.botaoCriarMetricas} onPress={() => back()}>
          <Icon
            name="chevron-left"
            color={"black"}
            size={20}
            style={styles.chevronLeft}
          />
        </Pressable>
        <View style={styles.photoAndName}>
          {user?.id && idoso?.id && (
            <View style={styles.photoAndName}>
              {getFoto(idoso?.foto)}
              <Text style={styles.nomeUsuario}>
                <Text style={styles.negrito}>{idoso?.nome}</Text>
              </Text>
            </View>
          )}
        </View>
        <View style={styles.none}></View>
      </View>
      <Text style={styles.textoAbaixoDoBotao}>
        <Text style={styles.text}>Selecione a métrica a ser cadastrada</Text>
      </Text>

      <View style={styles.metricCardsContainer}>
        {renderMetricCard(
          EMetricas.FREQ_CARDIACA,
          "heartbeat",
          "Frequência Cardíaca",
          "#FF7D7D",
        )}
        {renderMetricCard(
          EMetricas.PRESSAO_SANGUINEA,
          "tint",
          "Pressão Sanguínea",
          "#FF7D7D",
        )}
        {renderMetricCard(
          EMetricas.SATURACAO_OXIGENIO,
          "oxygen",
          "Saturação do Oxigênio",
          "87F4E4",
        )}
        {renderMetricCard(
          EMetricas.TEMPERATURA,
          "thermometer",
          "Temperatura",
          "FFAC7D",
        )}
        {renderMetricCard(EMetricas.GLICEMIA, "cubes", "Glicemia", "#3F3F3F")}

        {renderMetricCard(
          //Apenas para o caso de serem necessários nesta tela (se não forem, podem excluir)
          EMetricas.ALTURA,
          "user",
          "Altura (m)",
          "#3F3F3F",
        )}

        {renderMetricCard(
          //Apenas para o caso de serem necessários nesta tela (se não forem, podem excluir)
          EMetricas.PESO,
          "balance-scale",
          "Peso (kg)",
          "#000000",
        )}

        {renderMetricCard(
          EMetricas.HORAS_DORMIDAS,
          "bed",
          "Horas Dormidas",
          "#3F3F3F",
        )}

        {renderMetricCard(
          EMetricas.HIDRATACAO,
          "cup-water",
          "Hidratação",
          "#1075c8",
        )}
      </View>

      {/* Adicione aqui o restante do conteúdo do componente criarMetrica */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 100,
    backgroundColor: "#2CCDB5",
  },
  photoAndName: {
    padding: 10,
    flexDirection: "column",
    alignSelf: "center",
    alignItems: "center",
  },
  none: { width: 30 }, // necessário para alinhar a foto, NÃO REMOVA
  fotoPerfil: {
    width: 60,
    aspectRatio: 1,
    borderRadius: 100,
  },
  semFoto: { position: "relative", backgroundColor: "#EFEFF0" },
  semFotoIcon: {
    opacity: 0.4,
    margin: "auto",
    alignSelf: "center",
  },
  nomeUsuario: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 10,
    maxWidth: "100%",
  },
  container: {
    flexGrow: 1,
  },
  botaoCriarMetricas: {},
  chevronLeft: {
    marginLeft: 15,
    width: 15,
  },
  textoBotaoCriarMetricas: {
    color: "#3F3F3F",
    fontSize: 17,
    marginLeft: 15,
  },
  textoAbaixoDoBotao: {
    marginTop: 30,
    textAlign: "center",
    color: "#3F3F3F",
    fontSize: 20,
  },
  metricCardsContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  metricCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  metricCardIcon: {
    marginRight: 10,
  },
  metricCardText: {
    color: "#3F3F3F",
    fontSize: 16,
  },
  metricsName: {
    flexDirection: "column",
    alignItems: "center",
  },
  imagem: {
    width: 45,
    height: 45,
    borderRadius: 30,
  },
  name: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
  },
  metricCardContent: {
    flex: 1,
    flexDirection: "row",
    //alignItems: "center",
    justifyContent: "space-between",
  },
  cadastrarPlaceholder: {
    color: "#A9A9A9",
    fontSize: 12,
    marginTop: 5,
  },
  oxygenSymbol: {
    fontSize: 30,
    color: "#3F3F3F",
    marginRight: 10,
  },
  negrito: {
    fontWeight: "bold",
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});
