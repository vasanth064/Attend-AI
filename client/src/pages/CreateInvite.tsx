import { Button } from '@/components/ui/button';
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  addFormItem,
  removeFormItem,
  resetForm,
  updateFormItem,
} from '@/redux/invite/formSlice';
import { FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Option, useCreateInviteMutation } from '@/redux/invite/inviteApiSlice';
import InviteForm from './InviteForm';

const fieldTypes = [
  { label: 'Text', value: 'text' },
  { label: 'Email', value: 'email' },
  { label: 'Select', value: 'select' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Color', value: 'color' },
  { label: 'File', value: 'file' },
  { label: 'URL', value: 'url' },
  { label: 'Month', value: 'month' },
  { label: 'Week', value: 'week' },
  { label: 'Date', value: 'date' },
  { label: 'Date Time', value: 'datetime-local' },
  { label: 'Time', value: 'time' },
];

const FieldTypes = () => {
  return fieldTypes.map((fieldType) => (
    <SelectItem key={fieldType.value} value={fieldType.value}>
      {fieldType.label}
    </SelectItem>
  ));
};

const CreateInvite = () => {
  const form = useSelector((state: RootState) => state.form.formStructure);
  const dispatch = useDispatch();
  const labelRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<string>('text');
  const optionLabelRef = useRef<HTMLInputElement>(null);
  const optionValueRef = useRef<HTMLInputElement>(null);
  const linkNameRef = useRef<HTMLInputElement>(null);
  const [createInviteLink, { isLoading }] = useCreateInviteMutation();
  const [selectOptions, setSelectOptions] = useState<Option[]>([]);
  const handleTypeChange = (value: string, index: number) => {
    dispatch(updateFormItem({ index, data: { type: value } }));
  };
  const handleLabelChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    dispatch(updateFormItem({ index, data: { label: e.target.value } }));
  };
  const handleOptionLabelChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    optionIndex: number | boolean
  ) => {
    if (optionIndex) {
      dispatch(
        updateFormItem({
          index,
          data: { label: e.target.value },
          optionIndex,
        })
      );
    } else {
      const newOptions = selectOptions.map((option, optIndex) => {
        if (optIndex === index) {
          option.label = e.target.value;
        }
        return option;
      });
      setSelectOptions(newOptions);
    }
  };
  const handleOptionValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    optionIndex: number | boolean
  ) => {
    if (optionIndex) {
      dispatch(
        updateFormItem({
          index,
          data: { value: e.target.value },
          optionIndex,
        })
      );
    } else {
      const newOptions = selectOptions.map((option, optIndex) => {
        if (optIndex === index) {
          option.value = e.target.value;
        }
        return option;
      });
      setSelectOptions(newOptions);
    }
  };

  return (
    <div className='flex flex-col gap-3'>
      <h1 className='text-2xl'>Create Invite Link</h1>
      <div className='border border-gray-200 p-3 rounded-md gap-4'>
        <FormItem>
          <Label>Link Name</Label>
          <Input
            name='linkName'
            placeholder='Enter link name'
            ref={linkNameRef}
          />
        </FormItem>
      </div>
      <div className='flex flex-col border border-gray-200 p-3 rounded-md gap-4'>
        <FormItem>
          <Label>Field Label</Label>
          <Input type='text' placeholder='Enter label here' ref={labelRef} />
        </FormItem>
        <FormItem>
          <Label>Field Type</Label>
          <Select onValueChange={setType} value={type}>
            <SelectTrigger>
              <SelectValue placeholder='Select Field Type' />
            </SelectTrigger>
            <SelectContent>
              <FieldTypes />
            </SelectContent>
          </Select>
        </FormItem>
        {(type === 'select' || type === 'checkbox' || type === 'radio') &&
          selectOptions.length > 0 && (
            <div className='p-3 flex flex-col gap-3 border border-gray-200 rounded-md'>
              {selectOptions.map((option, index) => (
                <div
                  key={index}
                  className='flex gap-2 w-full items-center justify-between border border-gray-200 p-2 rounded-md gap-2'>
                  <FormItem className='w-full'>
                    <Label>Option Label</Label>
                    <Input
                      type='text'
                      placeholder='Enter label'
                      value={option.label}
                      onChange={(e) => handleOptionLabelChange(e, index, true)}
                    />
                  </FormItem>
                  <FormItem className='w-full'>
                    <Label>Option Value</Label>
                    <Input
                      type='text'
                      placeholder='Enter value'
                      value={option.value}
                      onChange={(e) => handleOptionValueChange(e, index, true)}
                    />
                  </FormItem>
                  <div
                    className='cursor-pointer w-10 h-10 p-2 hover:bg-gray-200 focus:outline-none rounded-md'
                    onClick={() => {
                      setSelectOptions((prevOptions) => [
                        ...prevOptions.filter(
                          (option) => option.value !== option.value
                        ),
                      ]);
                    }}>
                    <X />
                  </div>
                </div>
              ))}
            </div>
          )}
        {(type === 'select' || type === 'checkbox' || type === 'radio') && (
          <div className='p-3 flex flex-col gap-3 border border-gray-200 rounded-md'>
            <Label className='mb-2 text-md'>Add Options</Label>
            <FormItem>
              <Label>Option Label</Label>
              <Input
                type='text'
                placeholder='Enter label'
                ref={optionLabelRef}
              />
            </FormItem>
            <FormItem>
              <Label>Option Value</Label>
              <Input
                type='text'
                placeholder='Enter value'
                ref={optionValueRef}
              />
            </FormItem>
            <Button
              onClick={() => {
                if (
                  optionLabelRef.current?.value &&
                  optionValueRef.current?.value
                ) {
                  setSelectOptions((prevOptions) => [
                    ...prevOptions,
                    {
                      label: optionLabelRef.current?.value ?? '',
                      value: optionValueRef.current?.value ?? '',
                    },
                  ]);
                  optionLabelRef.current.value = '';
                  optionValueRef.current.value = '';
                } else {
                  return;
                }
              }}>
              Add Option
            </Button>
          </div>
        )}
        <Button
          onClick={() => {
            if (!labelRef?.current?.value || !type) return;
            if (
              (type === 'select' || type === 'checkbox' || type === 'radio') &&
              selectOptions.length == 0
            )
              return;

            dispatch(
              addFormItem({
                type: type,
                label: labelRef.current.value,
                options:
                  type === 'select' || type === 'checkbox' || type === 'radio'
                    ? selectOptions
                    : undefined,
              })
            );
            setType('');
            labelRef.current.value = '';
            setSelectOptions([]);
          }}>
          Add Field
        </Button>
      </div>
      <div className='flex flex-col gap-3'>
        {form.map((item, index) => (
          <div
            key={index}
            className='flex flex-col border border-gray-200 p-2 rounded-md gap-2'>
            <div
              className='self-end cursor-pointer w-10 h-10 p-2 hover:bg-gray-200 focus:outline-none rounded-md'
              onClick={() => {
                dispatch(removeFormItem(index));
              }}>
              <X />
            </div>
            <FormItem>
              <Label>Field Label</Label>
              <Input
                type='text'
                placeholder='Enter label here'
                value={item.label}
                onChange={(e) => handleLabelChange(e, index)}
              />
            </FormItem>
            <FormItem>
              <Label>Field Type</Label>
              <Select
                defaultValue={item.type}
                value={item.type}
                onValueChange={(value) => handleTypeChange(value, index)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select Field Type' />
                </SelectTrigger>
                <SelectContent>
                  <FieldTypes />
                </SelectContent>
              </Select>
            </FormItem>
            {(item.type === 'select' ||
              item.type === 'checkbox' ||
              item.type === 'radio') && (
              <div className='p-3 flex flex-col gap-3 border border-gray-200 rounded-md'>
                {item?.options?.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className='flex gap-2 w-full items-center justify-between border border-gray-200 p-2 rounded-md gap-2'>
                    <FormItem className='w-full'>
                      <Label>Option Label</Label>
                      <Input
                        type='text'
                        placeholder='Enter label'
                        value={option.label}
                        onChange={(e) =>
                          handleOptionLabelChange(e, index, optIndex)
                        }
                      />
                    </FormItem>
                    <FormItem className='w-full'>
                      <Label>Option Value</Label>
                      <Input
                        type='text'
                        placeholder='Enter value'
                        value={option.value}
                        onChange={(e) =>
                          handleOptionValueChange(e, index, optIndex)
                        }
                      />
                    </FormItem>
                    <div
                      className='cursor-pointer w-10 h-10 p-2 hover:bg-gray-200 focus:outline-none rounded-md'
                      onClick={() => {}}>
                      <X />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className='color-gray-400 text-sm py-3'>{item.id}</p>
          </div>
        ))}
        {form.length === 0 ? (
          <div className='flex flex-col border border-gray-200 p-2 rounded-md gap-2'>
            <p className='color-gray-400 text-sm py-3'>
              You have not added any fields yet.
            </p>
          </div>
        ) : (
          <>
            <Button
              variant='secondary'
              onClick={() => {
                dispatch(resetForm());
              }}>
              Reset
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => {
                createInviteLink({
                  name: linkNameRef.current?.value,
                  config: form,
                });
              }}>
              Create Invite Link
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateInvite;
