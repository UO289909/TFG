/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useBooks } from './useBooks';
import { Book } from '../../core/entities/book.entity';
import { getReadingLogs } from '../../core/use-cases/books/get-reading-logs.use-case';
import { useProfile } from './useProfile';
import { getUsersLatestReads } from '../../core/use-cases/books/get-users-latest-reads.use-case';


export const useStats = () => {

    const { myBooks, refetch } = useBooks();
    const { friends, refetchFriends } = useProfile();

    const [loadingUserStats, setLoadingUserStats] = useState(false);
    const [pagesThisMonth, setPagesThisMonth] = useState(0);
    const [lastBook, setLastBook] = useState<Book>();
    const [totalBooks, setTotalBooks] = useState(0);

    const [loadingFriendsRecentReads, setLoadingFriendsRecentReads] = useState(true);
    const [friendsRecentReads, setFriendsRecentReads] = useState<{ nickname: string; book: Book; }[]>([]);

    const [loadingFriendsPagesRead, setLoadingFriendsPagesRead] = useState(false);
    const [friendsPagesRead, setFriendsPagesRead] = useState<{ nickname: string, pages: number }[]>([]);


    useEffect(() => {
        if (myBooks.length > 0) {
            calculateUserStats();
        }
    }, [myBooks]);

    useEffect(() => {
        if (friends.length > 0) {
            setLoadingFriendsRecentReads(true);
            setLoadingFriendsPagesRead(true);
            calculateFriendsRecentReads();
            calculateFriendsPagesRead();
        } else {
            setFriendsRecentReads([]);
            setFriendsPagesRead([]);
            setLoadingFriendsRecentReads(false);
            setLoadingFriendsPagesRead(false);
        }
    }, [friends]);

    const refetchUserStats = async () => {
        await refetch();
    };

    const refetchFriendsStats = async () => {
        await refetchFriends();
    };

    const calculateUserStats = async () => {

        console.log('Calculating user stats...');
        setLoadingUserStats(true);

        const now = new Date();
        const currentMonth = now.getUTCMonth();
        const currentYear = now.getUTCFullYear();

        const readingLogs = await getReadingLogs();

        const logsThisMonth = readingLogs.filter(log => {
            const logDate = new Date(log.reading_date);
            return logDate.getUTCMonth() === currentMonth && logDate.getUTCFullYear() === currentYear;
        });

        const logsByIsbn: { [isbn: string]: typeof readingLogs } = {};
        logsThisMonth.forEach(log => {
            if (!logsByIsbn[log.isbn]) {
                logsByIsbn[log.isbn] = [];
            }
            logsByIsbn[log.isbn].push(log);
        });

        let pagesReadThisMonth = 0;
        Object.values(logsByIsbn).forEach(logs => {
            const sortedLogs = logs.sort((a, b) => new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime());
            const fromPage = sortedLogs[0].from_page ?? 0;
            const toPage = sortedLogs[sortedLogs.length - 1].to_page ?? 0;
            const diff = Math.max(0, toPage - fromPage);
            pagesReadThisMonth += diff;
        });

        const lastReadBook = myBooks
            .slice()
            .sort((a, b) => {
                const aDate = a.finish_date ? new Date(a.finish_date) : new Date(a.created_at!);
                const bDate = b.finish_date ? new Date(b.finish_date) : new Date(b.created_at!);
                return bDate.getTime() - aDate.getTime();
            })[0];

        setPagesThisMonth(pagesReadThisMonth);
        setLastBook(lastReadBook);
        setTotalBooks(myBooks.length);

        setLoadingUserStats(false);
        console.log('Finished calculating user stats.');

    };

    const calculateFriendsRecentReads = async () => {

        console.log('Calculating friends recent reads...');
        setLoadingFriendsRecentReads(true);

        const recentReads: { nickname: string; book: Book; }[] = await getUsersLatestReads(friends);

        setFriendsRecentReads(recentReads);

        setLoadingFriendsRecentReads(false);
        console.log('Finished calculating friends recent reads.');

    };

    const calculateFriendsPagesRead = async () => {
        console.log('Calculating friends pages read this month...');
        setLoadingFriendsPagesRead(true);

        const now = new Date();
        const currentMonth = now.getUTCMonth();
        const currentYear = now.getUTCFullYear();

        const friendsPagesReadPromises = friends.map(async friend => {
            const readingLogs = await getReadingLogs(friend.id);

            const logsThisMonth = readingLogs.filter(log => {
                const logDate = new Date(log.reading_date);
                return logDate.getUTCMonth() === currentMonth && logDate.getUTCFullYear() === currentYear;
            });

            const logsByIsbn: { [isbn: string]: typeof readingLogs } = {};
            logsThisMonth.forEach(log => {
                if (!logsByIsbn[log.isbn]) {
                    logsByIsbn[log.isbn] = [];
                }
                logsByIsbn[log.isbn].push(log);
            });

            let pagesReadThisMonth = 0;
            Object.values(logsByIsbn).forEach(logs => {
                const sortedLogs = logs.sort((a, b) => new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime());
                const fromPage = sortedLogs[0].from_page ?? 0;
                const toPage = sortedLogs[sortedLogs.length - 1].to_page ?? 0;
                const diff = Math.max(0, toPage - fromPage);
                pagesReadThisMonth += diff;
            });

            return { nickname: friend.nickname, pages: pagesReadThisMonth };
        });

        const userReadingLogs = await getReadingLogs();
        const userLogsThisMonth = userReadingLogs.filter(log => {
            const logDate = new Date(log.reading_date);
            return logDate.getUTCMonth() === currentMonth && logDate.getUTCFullYear() === currentYear;
        });

        const userLogsByIsbn: { [isbn: string]: typeof userReadingLogs } = {};
        userLogsThisMonth.forEach(log => {
            if (!userLogsByIsbn[log.isbn]) {
                userLogsByIsbn[log.isbn] = [];
            }
            userLogsByIsbn[log.isbn].push(log);
        });

        let userPagesReadThisMonth = 0;
        Object.values(userLogsByIsbn).forEach(logs => {
            const sortedLogs = logs.sort((a, b) => new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime());
            const fromPage = sortedLogs[0].from_page ?? 0;
            const toPage = sortedLogs[sortedLogs.length - 1].to_page ?? 0;
            const diff = Math.max(0, toPage - fromPage);
            userPagesReadThisMonth += diff;
        });

        const friendsPagesReadResults = await Promise.all(friendsPagesReadPromises);

        const allPagesReadResults = [
            ...friendsPagesReadResults,
            { nickname: 'Tú', pages: userPagesReadThisMonth },
        ];

        allPagesReadResults.sort((a, b) => b.pages - a.pages);

        setFriendsPagesRead(allPagesReadResults);

        setLoadingFriendsPagesRead(false);
        console.log('Finished calculating friends pages read this month:', allPagesReadResults);
    };

    return {
        loadingUserStats,
        loadingFriendsRecentReads,
        loadingFriendsPagesRead,
        pagesThisMonth,
        lastBook,
        totalBooks,
        friendsRecentReads,
        friendsPagesRead,
        refetchUserStats,
        refetchFriendsStats,
    };

};
