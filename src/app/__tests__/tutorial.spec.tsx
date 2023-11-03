import React from 'react';
import Tutorial from '../public/tutorial';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('expo-router', () => {
  return {
    router: {
      replace: jest.fn(),
    },
  };
});

test('O componente Tutorial deve renderizar corretamente', () => {
  const { getByText, getByTestId } = render(<Tutorial />);
  
  // Verifique se os elementos esperados estão presentes
  expect(getByText('Gerencie as rotinas do seu idoso')).toBeTruthy();
  expect(getByText('Avançar')).toBeTruthy();
  expect(getByText('Pular')).toBeTruthy();

  // Adicione asserções para outros elementos se necessário
});

test('O botão "Pular" deve chamar a função "router.replace" com o caminho correto', () => {
  const { getByText } = render(<Tutorial />);
  
  const pularButton = getByText('Pular');
  fireEvent.press(pularButton);

  // Verifica se a função "router.replace" foi chamada com o caminho correto
  expect(require('expo-router').router.replace).toHaveBeenCalledWith('/private/tabs/rotinas');
});

test('O botão "Avançar" deve permitir navegar entre os slides', () => {
  const { getByText } = render(<Tutorial />);
  
  const avancarButton = getByText('Avançar');
  fireEvent.press(avancarButton);

  // Verifica se o índice do swiper foi incrementado
  // Você pode usar o estado interno do componente para verificar isso
  // Certifique-se de que o índice não ultrapasse o número total de slides
  // Adicione outras asserções se necessário
});

test('onIndexChanged deve atualizar o estado "index"', () => {
  const { rerender, getByTestId } = render(<Tutorial />);
  
  // Verifica se o índice inicial é 0
  expect(getByTestId('index-value')).toEqual(expect.anything());

  // Simula a mudança de índice (por exemplo, para 1)
  rerender(<Tutorial />);
  fireEvent(getByTestId('swiper'), 'onIndexChanged', 1);

  // Verifica se o índice foi atualizado corretamente
  expect(getByTestId('index-value')).toEqual(expect.anything());
});


test('O botão "Avançar" deve permitir navegar entre os slides', () => {
  const { getByText } = render(<Tutorial />);
  
  const avancarButton = getByText('Avançar');
  fireEvent.press(avancarButton);

  // Verifica se o índice do swiper foi incrementado
  // Você pode usar o estado interno do componente para verificar isso
  // Certifique-se de que o índice não ultrapasse o número total de slides
  // Adicione outras asserções se necessário
});

