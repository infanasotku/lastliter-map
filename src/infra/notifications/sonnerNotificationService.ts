import type { NotificationService } from "@/features/notifications/ports";
import { toast } from "vue-sonner";

export class SonnerNotificationService implements NotificationService {
  error(message: string): void {
    toast.error(message);
  }
}
