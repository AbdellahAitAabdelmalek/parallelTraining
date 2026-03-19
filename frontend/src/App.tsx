import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/feature/user/data_integration/useProfile";
import Cim10Suggester from "@/feature/cim10/ui_component/Cim10Suggester";
import Header from "@/feature/user/ui_component/Header";

export default function App() {
  const { signOut } = useAuth();
  const { data: profileRes } = useProfile();
  const profile = profileRes?.body;

  return (
    <div className='min-h-screen bg-blue-50 flex flex-col items-center  p-6 gap-40 pt-20'>
      <Header firstName={profile?.firstName} onSignOut={signOut} />

      <div className='bg-white rounded-2xl shadow-md w-full max-w-2xl p-8 space-y-6'>
        <h1 className='text-2xl font-bold text-gray-800'>
          Suggestion de codes CIM-10
        </h1>
        <Cim10Suggester />
      </div>
    </div>
  );
}
