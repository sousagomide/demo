'use client'

import { registerUser } from '@/app/actions/authActions';
import { registerSchema, RegisterSchema } from '@/lib/schemas/registerSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { p } from 'framer-motion/client';
import React from 'react'
import { useForm } from 'react-hook-form';
import { SiGoogleforms } from 'react-icons/si';

export default function RegisterForm() {
    const {register, handleSubmit, setError, formState: {errors, isValid, isSubmitting}} = useForm<RegisterSchema>({
        //resolver: zodResolver(registerSchema),
        mode: 'onTouched'
    });
    
    const onSubmit = async (data: RegisterSchema) => {
        const result = await registerUser(data);
        if(result.status === 'success') {
            console.log('Usuário registrado com sucesso', result.data);
        } else {
            if (Array.isArray(result.error)) {
                result.error.forEach((e: any) => {
                    const fieldName = e.path.join('.')
                    setError(fieldName as keyof RegisterSchema, {message: e.message})
                })
            } else {
                setError('root.serverError', {message: result.error})
            }
        }
    }

  
    return (
    <Card className='w-2/5 mx-auto'>
        <CardHeader className='flex flex-col items-center justify-center'>
            <div className='flex flex-col gap-2 items-center text-secondary'>
                <div className='flex flex-row items-center gap-3'>
                    <SiGoogleforms size={30} />
                    <h1 className='text-3xl font-semibold'>Registrar</h1>
                </div>
                <p className='text-neutral-500'>Bem vindo ao NextMatch</p>
            </div>
        </CardHeader>
        <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='space-y-4'>
                    <Input
                        label='Nome' 
                        variant='bordered' 
                        {...register('name')} 
                        defaultValue=''
                        isInvalid={!!errors.name}
                        errorMessage={errors.name?.message}
                    />
                    <Input
                        label='Email' 
                        variant='bordered' 
                        {...register('email')} 
                        defaultValue=''
                        isInvalid={!!errors.email}
                        errorMessage={errors.email?.message}
                    />
                    <Input 
                        label='Senha' 
                        variant='bordered' 
                        type='password' 
                        {...register('password')} 
                        defaultValue=''
                        isInvalid={!!errors.password}
                        errorMessage={errors.password?.message}
                    />
                    {errors.root?.serverError && (
                        <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
                    )}
                    <Button isLoading={isSubmitting} isDisabled={!isValid} type='submit' color='secondary' fullWidth>Registrar</Button>
                </div>
            </form>
        </CardBody>
    </Card>
  )}
