type ShortcutObj = {
    keyCode: string;
    modifier?: string;
    description: string;
    fn: (params?: any) => void;
};

export type ShortcutStoreObj = {
    shortcuts: Array<ShortcutObj>;
};
