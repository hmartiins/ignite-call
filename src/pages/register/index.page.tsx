import { useEffect } from "react";
import { useRouter } from "next/router";

import { AxiosError } from "axios";

import { Heading, MultiStep, Text, TextInput, Button } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";

import { z } from "zod";
import { useForm } from "react-hook-form";

import { Container, Form, FormError, Header } from "./styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../lib/axios";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "O usuário precisa ter no mínimo 3 letras" })
    .regex(/^([a-z\\-]+)$/i, {
      message: "O usuário pode conter apenas letras e hifens",
    })
    .transform((username) => username.toLowerCase()),

  name: z
    .string()
    .min(3, { message: "O nome precisa ter pelo menos 3 letras." }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const router = useRouter();
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  useEffect(() => {
    if (router.query?.username) {
      setValue("username", String(router.query?.username));
    }
  }, [router.query?.username, setValue]);

  async function handleRegister({ name, username }: RegisterFormData) {
    try {
      await api.post("/users", {
        name,
        username,
      });

      await router.push("/register/connect-calendar");
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message);
        return;
      }

      console.error(err);
    }
  }

  return (
    <Container>
      <Header>
        <Heading as={"strong"}>Bem-vindo ao Ignite Call</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form onSubmit={handleSubmit(handleRegister)} as="form">
        <label>
          <Text size={"sm"}>Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="Seu usuário"
            {...register("username")}
          />

          {errors.username && (
            <FormError size={"sm"}>{errors.username.message}</FormError>
          )}
        </label>

        <label>
          <Text size={"sm"}>Nome completo</Text>
          <TextInput placeholder="Seu nome" {...register("name")} />

          {errors.name && (
            <FormError size={"sm"}>{errors.name.message}</FormError>
          )}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  );
}
