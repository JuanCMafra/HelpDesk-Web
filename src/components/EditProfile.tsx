import { useAuth } from "../hooks/useAuth";

import TrashIcon from "../assets/icons/trash.svg?react";

import { Input } from "./UI/Input";
import { Button } from "./UI/Button";
import { Upload } from "./UI/Upload";

import { PopUp } from "./PopUp";
import { Profile } from "./Profile";

import { api } from "../services/api";
import z from "zod";

import { useActionState, useEffect, useState } from "react";

import type { FormState } from "../utils/formState";
import { handleFormError } from "../utils/handleFormError";
import { AlertMessage } from "./AlertMessage";

type Props = React.ComponentProps<"form"> & {
  profile: boolean;
  setProfile: React.Dispatch<React.SetStateAction<boolean>>;
};

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, { message: "Nome e sobrenome devem ter mais de 5 letras!" }),
  email: z.email({ message: "Informe um e-mail válido!" }),
});

const passwordSchema = z.object({
  currentPassword: z.string({ message: "Senha inválida!" }),
  newPassword: z.string().trim().min(6, { message: "Senha nova inválida!" }),
});

export function EditProfile({ profile, setProfile, ...rest }: Props) {
  const auth = useAuth();

  const [changePassword, setChangePassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [statePassword, formActionPassword, pendingPassword] = useActionState(
    passwordAction,
    null,
  );

  const [stateProfile, formActionProfile, pendingProfile] = useActionState(
    profileAction,
    null,
  );
  const [file, setFile] = useState<File | null>(null);
  const [avatarMessage, setAvatarMessage] = useState<FormState | null>(null);

  useEffect(() => {
    if (!profile) return;

    setName(auth.session?.user.name ?? "");
    setEmail(auth.session?.user.email ?? "");
  }, [profile, auth.session?.user.name, auth.session?.user.email]);

  useEffect(() => {
    if (stateProfile?.field === "confirm") {
      setProfile(true);
    }
  }, [stateProfile, setProfile]);

  async function profileAction(
    _prevState: any,
    formData: FormData,
  ): Promise<FormState> {
    try {
      const data = profileSchema.parse({
        name: formData.get("name"),
        email: formData.get("email"),
      });

      let avatar = auth.session?.user.avatar;

      if (file) {
        const fileUploadForm = new FormData();
        fileUploadForm.append("file", file);

        const response = await api.post("/profile/avatar", fileUploadForm);

        avatar = response.data.filename ?? avatar;
      }

      await api.patch("/profile", {
        ...data,
        avatar,
      });

      const shouldUpdateSession =
        auth.session?.user &&
        (data.name !== auth.session.user.name ||
          data.email !== auth.session.user.email ||
          avatar !== auth.session.user.avatar);

      if (shouldUpdateSession) {
        auth.updateSession({
          name: data.name,
          email: data.email,
          avatar,
        });
      }
      setAvatarMessage({
        message: "Perfil alterado com sucesso!",
        field: "confirm",
      });
      return { message: "Perfil alterado com sucesso!", field: "confirm" };
    } catch (error) {
      return handleFormError(error);
    }
  }

  async function passwordAction(
    _prevState: any,
    formData: FormData,
  ): Promise<FormState> {
    try {
      const data = passwordSchema.parse({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
      });
      await api.patch("/profile/password", data);

      setAvatarMessage({
        message: "Senha alterada com sucesso!",
        field: "confirm",
      });
      return {};
    } catch (error) {
      return handleFormError(error);
    }
  }

  async function removeAvatar() {
    try {
      await api.patch("/profile/avatar");

      auth.updateSession({
        avatar: undefined,
      });

      setFile(null);

      setAvatarMessage({
        message: "Foto removida com sucesso!",
        field: "confirm",
      });
    } catch (error) {
      setAvatarMessage(handleFormError(error));
    }
  }

  return (
    <div>
      <PopUp
        setState={setProfile}
        backIcon={false}
        state={profile}
        title="Perfil"
        backState={undefined}
        isLoading={pendingProfile}
        onAction={formActionProfile}
      >
        <div className="flex flex-col items-start gap-5">
          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center justify-center gap-3">
              <Profile
                name={auth.session?.user.name}
                variants="xlg2"
                avatar={auth.session?.user.avatar}
              />

              <div className="flex gap-1">
                <Upload
                  filename={file && file?.name}
                  name="avatar"
                  onChange={setFile}
                />

                {auth.session?.user.avatar && (
                  <TrashIcon
                    className="text-feedback-danger w-7 h-7 p-1 cursor-pointer bg-gray-500 rounded-md hover:brightness-95 transition duration-300 ease-in-out"
                    onClick={() => removeAvatar()}
                  />
                )}
              </div>
            </div>
            <AlertMessage message={avatarMessage} />
          </div>

          <div className="flex justify-center relative flex-col gap-4 w-full">
            <Input
              required
              legend="nome"
              type="text"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              formState={stateProfile}
            />
            <Input
              required
              legend="e-mail"
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              formState={stateProfile}
            />
            <Input
              legend="senha"
              type="password"
              disabled
              readOnly
              value="••••••••"
            />
            <Button
              onClick={() => {
                setProfile(false);
                setChangePassword(true);
              }}
              variant="iconLightSm"
              className="absolute bottom-2 right-0 text-xs bg-gray-500 px-2 py-[5.5px] font-bold "
            >
              Alterar
            </Button>
          </div>

          <AlertMessage message={stateProfile} />
        </div>

        {auth.session?.user.role === "technician" && (
          <div className="items-start justify-center  flex flex-col gap-3">
            <div>
              <h3 className="text-gray-200 text-sm font-bold">
                Disponibilidade
              </h3>
              <span className="text-xs text-gray-300">
                Horários de atendimento definidos pelo admin
              </span>
            </div>

            <ul className="flex flex-wrap items-start justify-baseline gap-2">
              {auth.session?.user.technician?.availability.map(
                (hours, index) => {
                  return (
                    <li
                      key={index}
                      className="p-1.5 border rounded-full border-gray-500 text-xs text-gray-400"
                    >
                      {hours}
                    </li>
                  );
                },
              )}
            </ul>
          </div>
        )}
      </PopUp>

      <PopUp
        backIcon={true}
        setState={setChangePassword}
        state={changePassword}
        backState={setProfile}
        title="Alterar senha"
        onAction={formActionPassword}
        isLoading={pendingPassword}
      >
        <Input
          required
          legend="senha atual"
          type="password"
          placeholder="Digite sua senha atual"
          name="currentPassword"
          formState={statePassword}
        />
        <Input
          required
          legend="nova senha"
          type="password"
          placeholder="Digite sua nova senha"
          helper="Mínimo de 6 dígitos"
          name="newPassword"
          formState={statePassword}
        />

        <AlertMessage message={statePassword} />
      </PopUp>
    </div>
  );
}
