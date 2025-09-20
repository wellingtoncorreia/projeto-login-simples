'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import api from '../lib/api';
import { ProdutoForm } from '../types/ProdutoForm'; 

export function useFormularioProduto(id?: string) {
  const router = useRouter();
  const [form, setForm] = useState<ProdutoForm>({ nome: '', descricao: '', preco: '', url: '' });
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      api.get(`/produtos/${id}`)
        .then(response => setForm(response.data))
        .catch(() => {
          Swal.fire('Erro', 'Produto não encontrado', 'error').then(() => router.push('/produtos'));
        });
    }
  }, [id, isEditMode, router]);

  return {
    form,
    isEditMode,
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm(currentForm => ({ ...currentForm, [name]: value }));
    },
    handleCancel: () => {
      router.push('/produtos');
    },

    handleSubmit: (e: React.FormEvent) => {
      e.preventDefault();
      
      const produtoParaEnviar = { ...form, preco: Number(form.preco) };
      const method = isEditMode ? 'put' : 'post';
      const url = isEditMode ? `/produtos/${id}` : '/produtos/';
      const successMessage = `Produto ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`;

      api[method](url, produtoParaEnviar)
        .then(() => {
          return Swal.fire('Sucesso', successMessage, 'success');
        })
        .then(() => {
    
          router.push('/produtos');
        })
        .catch((error) => {
          console.error("Falha ao salvar o produto:", error);
          Swal.fire('Erro', 'Não foi possível salvar o produto.', 'error');
        });
    },
  };
}