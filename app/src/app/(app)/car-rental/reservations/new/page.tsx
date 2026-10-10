import { getLocations, getVehicleClasses, getVehicles, getContacts } from "@/lib/db";
import NewReservationForm from "./_components/new-reservation-form";

export const instant = false;

export default async function NewReservationPage() {
  const [locations, vehicleClasses, vehicles, contacts] = await Promise.all([
    getLocations(),
    getVehicleClasses(),
    getVehicles("available"),
    getContacts("customer"),
  ]);

  return (
    <NewReservationForm
      locations={locations}
      vehicleClasses={vehicleClasses}
      vehicles={vehicles}
      contacts={contacts}
    />
  );
}
