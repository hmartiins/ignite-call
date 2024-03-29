import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { ArrowRight, Check } from "phosphor-react";
import { Heading, MultiStep, Text, Button } from "@ignite-ui/react";

import { Container, Header } from "../styles";
import { ConnectBox, ConnectItem, AuthError } from "./styles";

export default function ConnectCalendar() {
  const session = useSession();
  const router = useRouter();

  const hasAuthError = !!router.query.error;
  const isSignedIn = session.status === "authenticated";

  return (
    <Container>
      <Header>
        <Heading as={"strong"}>Conecte sua agenda</Heading>
        <Text>
          Conecte seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>

          {isSignedIn ? (
            <Button size={"sm"} disabled>
              Conectado
              <Check />
            </Button>
          ) : (
            <Button
              size={"sm"}
              variant={"secondary"}
              onClick={() => signIn("google")}
            >
              Conectar
            </Button>
          )}
        </ConnectItem>

        {hasAuthError && (
          <AuthError size={"sm"}>
            Falha ao se conectar ao Google, verifique se você habilitou as
            permissões de acesso ao Google Calendar
          </AuthError>
        )}

        <Button type="submit" disabled={!isSignedIn}>
          Próximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  );
}
