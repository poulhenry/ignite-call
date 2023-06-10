import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import * as S from './styles'
import { ArrowRight } from '@phosphor-icons/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '@/libs/api'
import { AxiosError } from 'axios'

const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Digite no minimo 3 caracteres' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letra e hifens',
    })
    .transform((username) => username.toLowerCase()),
  name: z.string().min(3, { message: 'Digite no minimo 3 caracteres' }),
})

type RegisterData = z.infer<typeof RegisterSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(RegisterSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: RegisterData) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })

      await router.push('/register/connect-calendar')
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.message) {
        alert(error.response?.data.message)
        return
      }
      console.error(error)
    }
  }

  return (
    <S.Container>
      <S.Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>

        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </S.Header>

      <S.Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuário"
            {...register('username')}
          />

          {errors.username && (
            <S.FormError>{errors.username.message}</S.FormError>
          )}
        </label>

        <label>
          <Text size="sm">Nome Completo</Text>
          <TextInput placeholder="Seu nome" {...register('name')} />

          {errors.username && (
            <S.FormError>{errors.username.message}</S.FormError>
          )}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Proximo Passo
          <ArrowRight />
        </Button>
      </S.Form>
    </S.Container>
  )
}
