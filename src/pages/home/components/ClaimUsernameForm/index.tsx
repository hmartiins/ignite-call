import zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, TextInput, Text } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";

import { Form, FormAnnotation } from "./styles";
import { useRouter } from "next/router";

const claimUserNameFormSchema = zod.object({
  username: zod
    .string()
    .min(3, { message: "O usuário precisa ter no mínimo 3 letras" })
    .regex(/^([a-z\\-]+)$/i, {
      message: "O usuário pode conter apenas letras e hifens",
    })
    .transform((username) => username.toLowerCase()),
});

type ClaimUsernameFormData = zod.infer<typeof claimUserNameFormSchema>;

export function ClaimUsernameForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUserNameFormSchema),
  });

  async function handleClaimUsername({ username }: ClaimUsernameFormData) {
    await router.push(`/register?username=${username}`);
  }

  return (
    <>
      <Form onSubmit={handleSubmit(handleClaimUsername)} as="form">
        <TextInput
          size={"sm"}
          prefix="ignite.com/"
          placeholder="Seu usuário"
          {...register("username")}
        />

        <Button size={"sm"} type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>

      <FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : "Digite o nome do usuário desejado"}
        </Text>
      </FormAnnotation>
    </>
  );
}
