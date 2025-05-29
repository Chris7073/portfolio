export interface SocialIcon {
  id: number;
  icon: string;
}

export function useSocialIcons(): { icons: SocialIcon[] } {
  const icons: SocialIcon[] = [
    { id: 1, icon: 'uil:facebook' },
    { id: 2, icon: 'uil:instagram' },
    { id: 3, icon: 'uil:globe' }
  ];
  return { icons };
}