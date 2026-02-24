import { useState } from 'react';

import { parseOPML } from '../../helpers/parseOPML';
import type { ParsedFeed } from '../../types';

export const FeedImporter = () => {
    const [toProcess, setToProcess] = useState<{ [key: string]: Array<ParsedFeed> } | null>(null);

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const parsed = parseOPML((reader.result as string) || '');
            setToProcess(parsed);

            console.log('Parsed OPML:', Object.entries(parsed));
        };
        reader.readAsText(file);
    };
    return (
        <>
            <p>
                <label>
                    Upload an OPML file to import your feeds:
                    <br />
                    <input type="file" onChange={handleUpload} accept=".opml" />
                </label>
            </p>
            <ol>
                {Object.entries(toProcess || {}).map(([category, feeds]) => (
                    <li key={category}>
                        <strong dangerouslySetInnerHTML={{ __html: category }} />
                        <ol>
                            {feeds.map((feed) => (
                                <li key={feed.title}>
                                    <strong>{feed.title}</strong>
                                    <br />
                                    <a href={feed.rss} target="_blank" rel="noopener noreferrer">
                                        {feed.rss}
                                    </a>
                                    <br />
                                    <a
                                        href={feed.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {feed.website}
                                    </a>
                                    <button>Edit</button>
                                    <button>Remove</button>
                                </li>
                            ))}
                        </ol>
                    </li>
                ))}
            </ol>
        </>
    );
};
