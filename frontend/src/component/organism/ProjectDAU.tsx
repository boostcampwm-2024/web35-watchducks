import DataLayout from '@component/template/DataLayout';
// import useProjectDAU from '@hook/api/useProjectDAU';

type Props = {
  id: string;
};

export default function ProjectDAU({ id }: Props) {
  // const { data } = useProjectDAU(id);
  return (
    <DataLayout cssOption='flex flex-col p-8 rounded-lg shadow-md w-full bg-white'>
      <div className='mb-8 text-center'>
        <h2 className='text-navy text-2xl font-bold'>DAU</h2>
      </div>
      <div className='h-[220px] w-full'>요기 라이브러리 코드적용 ${id}</div>
    </DataLayout>
  );
}
