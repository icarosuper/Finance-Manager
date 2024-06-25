'use client';

import Select from 'react-select/creatable';
import React, { useMemo } from 'react';
import { api } from '~/trpc/react';
import { type ControllerRenderProps, type FieldValues } from 'react-hook-form';

type Props = {
  onChange: (categoryId?: string) => void;
} & Partial<ControllerRenderProps<FieldValues, string>>;

type CategoryOption = {
  value: string;
  label: string;
};

export function PurchaseCategorySelect({ onChange, ...props }: Props) {
  const { data: categories } = api.purchaseCategories.getByUser.useQuery();

  const { mutate: createCategory } =
    api.purchaseCategories.create.useMutation();

  const filteredCategories: CategoryOption[] = useMemo(
    () => categories?.map(({ id, name }) => ({ value: id, label: name })) || [],
    [categories],
  );

  return (
    <Select<CategoryOption>
      {...props}
      options={filteredCategories}
      onChange={(value) => onChange(value?.value)}
      placeholder="Selecione a categoria"
      isSearchable
      isClearable
      noOptionsMessage={() => 'Nenhuma categoria encontrada'}
      formatCreateLabel={(inputValue) => `Criar categoria "${inputValue}"`}
      onCreateOption={(input) => createCategory({ name: input })}
    />
  );
}
