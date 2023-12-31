import { AuthModalState } from '@/atoms/authModalAtom';
import { Input, Button, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import OAuthButtons from './OAuthButtons';
import { useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../../firebase/clientApp'; 
import { FIREBASE_ERRORS } from '../../../firebase/errors'; 
import { addDoc, collection, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { stringify } from 'querystring';

const SignUp:React.FC = () => {
    const setAuthModalState = useSetRecoilState(AuthModalState);
    const [signUpForm, setSignUpForm] = useState({
        email: "",
        password: "",
        confirmPassword:"",
    });
    const [error, setError] = useState('');
    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        userError
      ] = useCreateUserWithEmailAndPassword(auth);

const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) setError("");
    if (signUpForm.password !== signUpForm.confirmPassword){
        setError("Passwords do not match")
        return;
    }
    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password)
};

const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // update form state
    setSignUpForm(prev => ({
        ...prev,
        [event.target.name]: event.target.value,
    }))
};

const createUserDocument = async (user: User) => {
    await addDoc(collection(firestore, 'users'), JSON.parse(JSON.stringify(user)));
}

useEffect(() => {
    if (userCred) {
        createUserDocument(userCred.user);
    }
}, [userCred]);


    
    return (
        <form onSubmit={onSubmit}>
            
           <Input 
           required
           name="email" 
           placeholder='Email' 
           type="email" 
           mb={2} 
           onChange={onChange}
           fontSize="10pt"
           _placeholder={{ color: 'gray.500' }}
           _hover={{
            bg:"white",
            border:"1px solid",
            borderColor:"#4682B4"
        }}
        _focus={{
            outline:"none",
            bg:"white",
            border:"1px solid",
            borderColor:"#4682B4"
        }}
        bg="gray.50"
           />
           <Input 
           required
           name="password" 
           placeholder='Password' 
           type="password" 
           mb={2}
           onChange={onChange}
           fontSize="10pt"
           _placeholder={{ color: 'gray.500' }}
           _hover={{
            bg:"white",
            border:"1px solid",
            borderColor:"#4682B4"
        }}
        _focus={{
            outline:"none",
            bg:"white",
            border:"1px solid",
            borderColor:"#4682B4"
        }}
        bg="gray.50"
           />
           <Input 
           required
           name="confirmPassword" 
           placeholder='Confirm Password' 
           type="password" 
           mb={2}
           onChange={onChange}
           fontSize="10pt"
           _placeholder={{ color: 'gray.500' }}
           _hover={{
            bg:"white",
            border:"1px solid",
            borderColor:"#4682B4"
        }}
        _focus={{
            outline:"none",
            bg:"white",
            border:"1px solid",
            borderColor:"#4682B4"
        }}
        bg="gray.50"
           />
           {(error || userError) && (
           <Text 
           textAlign="center" 
           color="red" 
           fontSize="10pt"> 
           {error || FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]} 
           </Text>  
           )}
           <Button width="100%" height="36px" mt={2} mb={2} 
           type="submit" isLoading={loading}>
            Sign Up
           </Button>

           <Flex fontSize='9pt' justifyContent='center'>
            <Text mr={1}> Already a GR8ER member? </Text>
            <Text 
            textColor="#4682B4" 
            fontWeight={700} 
            cursor="pointer"
            onClick={() => setAuthModalState(prev => ({
                ...prev,
                view: "login",
            }))} > LOG IN </Text>

           </Flex>
        </form>
    )
}
export default SignUp;
