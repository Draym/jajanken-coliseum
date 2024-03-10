'use client'

import React, {useState, FormEvent} from 'react';
import {Box, Input, Button, VStack, Text, InputGroup, InputRightElement, Flex, Stack} from '@chakra-ui/react';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = async (url: string) => {
    const response = await axios.get(url);
    return response.data;
};

const ChatBox: React.FC = () => {
    const [message, setMessage] = useState('');
    const {data, error} = useSWR('/api/chat/history', fetcher, { refreshInterval: 500 });
    const messages = data ? data.messages : [];

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await axios.post('/api/chat', {message});
        setMessage('');
    };

    if (error) return <div>Failed to load chat history</div>;
    if (!data) return <div>Loading...</div>;

    return (
        <Box border="1px" borderColor="gray.500" borderRadius="md" p={3} backgroundColor="gray.700" width='100%'
             height='100%'>
            <VStack spacing={4} align="stretch" overflowY="auto" maxHeight="50vh">
                {messages.map((msg: { name: string; message: string; date: string }, index: number) => (
                    <Box key={index} backgroundColor="gray.800" borderRadius="md" p={2}>
                        <Text color="gray.100" fontWeight="bold">{msg.name}</Text>
                        <Text color="gray.300">{msg.message}</Text>
                        <Text color="gray.500" fontSize="sm">{new Date(msg.date).toLocaleString()}</Text>
                    </Box>
                ))}
            </VStack>
            <form onSubmit={handleSubmit}>
                <InputGroup>
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                        color={'white'}
                        backgroundColor="gray.800"
                        borderRadius="md"
                        border="1px"
                        borderColor="gray.500"
                        my={2}
                        focusBorderColor="lime.400"
                    />
                    <InputRightElement h="full" marginRight={3}>
                        <Button size="sm" type="submit" backgroundColor="gray.400">
                            Send
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </form>
        </Box>
    );
};

export default ChatBox;