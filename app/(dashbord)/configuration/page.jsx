'use client';
import { useEffect, useState } from 'react';
import { useGetStaticsQuery, useUpdateConfigMutation } from '@/store';
import { showErrorToast, showSuccessToast } from '@/components/ui/toast';
import DropdownSelect from '@/components/ui/dropdown';

export default function Configuration() {
  const { data: staticData } = useGetStaticsQuery();
  const [updateConfig, { isLoading: Loading }] = useUpdateConfigMutation();

  const [phone, setPhone] = useState('+919039384177');
  const [voice, setVoice] = useState('en-US-LunaNeural');
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (staticData?.data) {
      setPhone(
        staticData?.data?.selectedNumber ||
        '+919039384177'
      );

      setVoice(staticData?.data?.selectedVoice || staticData.data.voices[0].value);

      setPrompt(staticData?.data?.prompt || '');

    }
  }, [staticData?.data]);


  const handleClick = async () => {
    try {
      const response = await updateConfig({
        phoneNumber: phone,
        voiceId: voice,
        prompt,
      }).unwrap();
      showSuccessToast(response?.message, {
        description: 'Configuration updated successfully',
      });
    } catch (err) {
      showErrorToast(err?.data?.message, {
        description: 'Config update failed.',
      });
    }
  };
  return (
    <div className='min-h-screen overflow-scroll bg-gray-50 p-6'>
      <form className='mx-auto w-full space-y-8'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold'>Configuration</h2>
          <button
            type='button'
            className='rounded-md text-sm bg-primary px-6 py-2 font-medium text-white shadow'
            onClick={handleClick}
          >
            Submit
          </button>
        </div>
        <div className='flex flex-col space-y-6 rounded-xl bg-white p-6 shadow'>
          <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
              <DropdownSelect
                label="Phone Number"
                placeholder="Select Phone"
                value={phone}
                 onChange={setPhone}
                options={
                  staticData?.data?.phoneNumbers?.map((p) => ({
                    label: p,
                    value: p,
                  })) || []

                }
              />

            </div>
            <div className='flex gap-4'>
              <DropdownSelect
                label='Voice Name :'
                value={voice}
                onChange={setVoice}
                options={
                  staticData?.data?.voices?.map((v) => ({
                    label: v.label,
                    value: v.value,
                  })) || []
                }
                placeholder='Select Voice'
              />
            </div>
          </div>
        </div>

        <div className='rounded-xl bg-white p-6 shadow'>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            Prompt:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-300 focus:outline-none focus:ring-0'
          ></textarea>
        </div>
      </form>
    </div>
  );
}
