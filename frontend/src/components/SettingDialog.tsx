/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { useCallback } from "react";
import { useFetcher } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/**
 * Custom modules
 */
import { cn } from "@/lib/utils";

/**
 * Components
 */
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/InputPassword";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

/**
 * Custom hooks
 */
import { useUser } from "@/hooks/useUser";

/**
 * Assets
 */
import { AtSignIcon, Loader2Icon, MailIcon } from "lucide-react";

/**
 * Types
 */
import type { DialogProps } from "@radix-ui/react-dialog";

/**
 * Profile form schema
 */
const profileFormSchema = z.object({
  firstName: z.string().max(20, "First name must be less than 20 characters"),
  lastName: z.string().max(20, "Last name must be less than 20 characters"),
  email: z
    .string()
    .max(50, "Email must be less than 50 characters")
    .email("Invalid email address"),
  username: z.string().max(20, "Username must be less than 20 characters"),
});

const ProfileSettingForm = () => {
  return <div>Profile setting form</div>;
};

/**
 * Password form schema
 */
const passwordFormSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password doesn't match",
    path: ["confirm_password"],
  });

const PasswordSettingForm = () => {
  return <div>Password settings form</div>;
};

export const SettingsDialog = ({
  children,
  ...props
}: React.PropsWithChildren<DialogProps>) => {
  return <div>Settings dialog</div>;
};
