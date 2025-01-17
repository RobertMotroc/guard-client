import React from 'react';
import { Text, View } from 'react-native';
import {
    useFonts,
    Oswald_200ExtraLight,
    Oswald_300Light,
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_600SemiBold,
    Oswald_700Bold
} from '@expo-google-fonts/oswald';

function Chip(props: {
    children: React.ReactElement;
    category:
        | 'CONFIRMED_THREAT'
        | 'REPORTED_THREAT'
        | 'CONFIRMED_INFO'
        | 'REPORTED_INFO'
        | 'NONE';
}) {
    let color = 'bg-[#E7E7E7]';

    if (props.category.includes('THREAT')) {
        color = 'bg-[#FF9393]';
    } else if (props.category.includes('INFO')) {
        color = 'bg-[#FFEE93]';
    }

    return (
        <View className={`flex flex-1 min-w-0`}>
            <View
                style={{ alignSelf: 'flex-start' }}
                className={`py-1 px-2 rounded-full ${color}`}
            >
                {props.children}
            </View>
        </View>
    );
}

export interface EventI {
    id: number;
    title: string;
    category:
        | 'CONFIRMED_THREAT'
        | 'REPORTED_THREAT'
        | 'CONFIRMED_INFO'
        | 'REPORTED_INFO'
        | 'NONE';
    time: Date;
    description: string;
}

export interface FriendI {
    id: number;
    friendName: string;
    recentEvent?: EventI;
}

export function FriendEntry(props: { friend: FriendI }) {
    const [fonts, error] = useFonts({
        Oswald_200ExtraLight,
        Oswald_300Light,
        Oswald_400Regular,
        Oswald_500Medium,
        Oswald_600SemiBold,
        Oswald_700Bold
    });

    if (!fonts && !error) {
        return null;
    }

    const time =
        new Date().getTime() / 1000 -
            props.friend.recentEvent?.time.getTime() / 1000 <=
        60
            ? 'NOW'
            : `${timeSince(props.friend.recentEvent?.time)} AGO`;

    return (
        <View className="w-full flex flex-col justify-between gap-3">
            <View className="w-full flex flex-row flex-nowrap items-center justify-between gap-2">
                <Text className="text-right text-base uppercase font-OswaldMedium">
                    {props.friend.friendName}
                </Text>
                <Text className="text-right text-sm uppercase font-OswaldLight">
                    Pinged {time}
                </Text>
            </View>

            {props.friend.recentEvent && (
                <Text className="text-base font-OswaldLight">
                    Latest incident near: {props.friend.recentEvent.title}
                </Text>
            )}
        </View>
    );
}

export function Event(props: { event: EventI }) {
    const [fonts, error] = useFonts({
        Oswald_200ExtraLight,
        Oswald_300Light,
        Oswald_400Regular,
        Oswald_500Medium,
        Oswald_600SemiBold,
        Oswald_700Bold
    });
    const time =
        new Date().getTime() / 1000 - props.event.time.getTime() / 1000 <= 60
            ? 'NOW'
            : `${timeSince(props.event.time)} AGO`;
    const label = props.event.category.includes('CONFIRMED')
        ? 'CONFIRMED'
        : 'REPORTED';

    if (!fonts && !error) {
        return null;
    }

    return (
        <View className="w-full flex flex-col gap-2">
            <View className="w-full flex flex-row flex-nowrap items-center justify-between gap-2">
                <Chip category={props.event.category}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className="text-base uppercase overflow-hidden font-OswaldSemiBold"
                    >{`${label}: ${props.event.title}`}</Text>
                </Chip>
                <Text className="text-right text-sm uppercase font-OswaldLight">
                    {time}
                </Text>
            </View>

            <Text className="text-base pl-2 font-OswaldLight">
                {props.event.description}
            </Text>
        </View>
    );
}

function timeSince(date: Date) {
    if (typeof date !== 'object') {
        date = new Date(date);
    }

    const seconds = Math.floor(
        new Date().getTime() / 1000 - date.getTime() / 1000
    );
    let intervalType = 'seconds';

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        intervalType = 'year';
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            intervalType = 'month';
        } else {
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                intervalType = 'day';
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    intervalType = 'hour';
                } else {
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        intervalType = 'minute';
                    } else {
                        interval = seconds;
                        intervalType = 'second';
                    }
                }
            }
        }
    }

    if (interval > 1 || interval === 0) {
        intervalType += 's';
    }

    return interval + ' ' + intervalType;
}
