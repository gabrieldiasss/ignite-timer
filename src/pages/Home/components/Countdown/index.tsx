import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CyclesContext } from '../../../../contexts/CycleContext'
import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext)

  // Converter a quantidade de minutos para segundos, ou seja 2 * 60 é igual 120, que é a quantidade de segundos
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  // Reduzindo countdown
  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        // Comparar a data atual, com a data salva, e ver quantos segundos já se passaram
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )

        // Se a diferença de segundos e o total de segundos, quer dizer que finalizou o ciclo
        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    // Quando iniciamos um novo ciclo e já tinha um ciclo antes no estado o useEffect executa denovo, porém podemos ter um retorno dentro do useEffect. A responsabilidade desse retorno é: limpar o useEffect anterior
    return () => {
      // Deletar os intervalos que não quero mais
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  ])

  // Conta para definir quanto tempo já passou, que é o total - o que já se passaram
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  // Calcular a partir do total de segundos, quantos minutos temos, ou seja, quantos minutos eu tenho dentro desse total de segundos?
  const minutesAmount = Math.floor(currentSeconds / 60)

  // Calcular quantos segundos eu tenho do resto dessa divisão
  const secondsAmount = currentSeconds % 60

  // PadStart - Preenche uma string até um tamanho específico, com algum caractere
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  // Mudar title da página
  useEffect(() => {
    // Se o ciclo tiver ativo
    if (activeCycle) {
      // Mudar title da página
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      {/* Podemos usar string como vetores, pegando a letra pela primeira posição */}
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
