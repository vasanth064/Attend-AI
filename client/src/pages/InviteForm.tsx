import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormConfig,
  Option,
  useGetInviteQuery,
} from '@/redux/invite/inviteApiSlice';
import { useParams } from 'react-router-dom';

interface InviteFormProps {
  previewMode: boolean;
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void | undefined;
}

const InviteForm: React.FC<InviteFormProps> = ({
  previewMode,
  handleSubmit,
}) => {
  const { id } = useParams();
  const { data, isLoading } = useGetInviteQuery(String(id));

  if (isLoading) return <div>Loading...</div>;
  return (
    data && (
      <form onSubmit={previewMode ? undefined : handleSubmit}>
        <h1 className='text-3xl font-bold'>{data?.name}</h1>
        <div className='flex flex-col gap-4 border border-gray-200 p-5 rounded-md my-5'>
          {(data.config as FormConfig[]).map(
            (item: FormConfig, index: number) => {
              if (item.type === 'select') {
                return (
                  <FormItem key={item.label}>
                    <Label>{item.label}</Label>
                    <Select name={item.label}>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${item.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {item.options?.map((option: Option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                );
              } else if (item.type === 'checkbox') {
                return (
                  <FormItem>
                    <div className='mb-4'>
                      <Label className='text-base'>{item.label}</Label>
                    </div>
                    {item.options?.map((option, optIndex) => (
                      <FormItem
                        key={optIndex}
                        className='flex flex-row items-start space-x-3 space-y-0'>
                        <Checkbox name={item.label} value={option.value} />
                        <Label className='font-normal'>{option.label}</Label>
                      </FormItem>
                    ))}
                  </FormItem>
                );
              } else {
                return (
                  <FormItem key={index}>
                    <Label>{item.label}</Label>
                    <Input
                      name={item.label}
                      type={item.type}
                      placeholder={`Enter ${item.label}`}
                    />
                  </FormItem>
                );
              }
            }
          )}
        </div>
        {!previewMode && (
          <Button type='submit' className='w-full'>
            Submit
          </Button>
        )}
      </form>
    )
  );
};

export default InviteForm;
