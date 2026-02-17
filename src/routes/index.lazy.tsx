import { Link, createLazyFileRoute } from '@tanstack/react-router';

import { parseOPML } from '@/features/feeds/helpers/parseOPML';

const RouteComponent = () => {
    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const parsed = parseOPML((reader.result as string) || '');
            console.log(parsed);
        };
        reader.readAsText(file);
    };

    return (
        <>
            <h1>What if someone made, like, a worse RSS feed reader?</h1>
            <p>
                You know what the world doesn't need? Another RSS feed reader. But I made one
                anyway. Why? Maybe I'm bored. Maybe because I hate all the other RSS feed readers
                I've used for one reason or another.
            </p>
            <p>Maybe I'm a glutton for punishment.</p>
            <p>
                <Link to="/feeds">Check it out if you want, I'm not your boss</Link>.
            </p>
            <p>
                <input type="file" onChange={handleUpload} />
            </p>
        </>
    );
};

export const Route = createLazyFileRoute('/')({
    component: RouteComponent,
});
