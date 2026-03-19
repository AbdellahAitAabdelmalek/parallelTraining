interface HeaderProps {
  firstName?: string;
  onSignOut: () => void;
}

export default function Header({ firstName, onSignOut }: HeaderProps) {
  return (
    <div className='flex items-center justify-between w-full max-w-2xl'>
      {firstName ? (
        <p className='text-xl font-semibold text-gray-700'>
          Bonjour, {firstName} !
        </p>
      ) : (
        <span />
      )}
      <button
        onClick={onSignOut}
        className='text-sm text-gray-500 hover:text-gray-700 underline'
      >
        Déconnexion
      </button>
    </div>
  );
}