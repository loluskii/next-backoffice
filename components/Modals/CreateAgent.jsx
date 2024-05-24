import { useEffect, useState } from 'react'
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Image,
  Box,
  Input,
  useMediaQuery,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
} from '@chakra-ui/react'
import NextImage from 'next/image'
import CreatableSelect from 'react-select/creatable'
import { useSession } from 'next-auth/react'
import { ErrorMessage, FormikProvider, useFormik } from 'formik'
import * as yup from 'yup'
import styled from 'styled-components'
import { useQueryClient } from '@tanstack/react-query'
import ModalContainer from '@/components/Modal'
import ProfileImg from '@/assets/profileIcon.svg'
import { useTypedSelector } from '@/hooks/hooks'
import { TextBox } from '../../ProfileModals/InputBox'
import ChooseMedia from '../../ProfileModals/ChooseMedia'
import notify from '@/libs/toast'
import {
  useCreateHashtag,
  useCreatePost,
  useGetAllHashtags,
} from '@/apis/dashboard'
import { handleOnError } from '@/libs/utils'
import CreatePostImgIcon from '@/assets/svgFiles/CreatePostImg.svg.next'
import CreatePostVidIcon from '@/assets/svgFiles/CreatePostVid.svg.next'
import CreatePostCamIcon from '@/assets/svgFiles/CreatePostCam.svg.next'
import AddMediaIcon from '@/assets/svgFiles/AddMedia.svg.next'
import VideoCameraIcon from "@/assets/VideoCameraIcon.svg";
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
} from '@heroicons/react/24/solid'

import ArrowBackMobileIcon from '@/assets/svgFiles/ArrowBackMobile.svg.next'
import MobileDrawerHeaderIcon from '@/assets/svgFiles/MobileDrawerHeader.svg.next'
import DeleteMediaIcon from '@/assets/svgFiles/DeleteMedia.svg.next'
import MediaSection from '../../ProfileModals/MediaSection'

export interface Option {
  readonly label: string
  readonly value: string
}

const CreatePost = ({
  onClose,
  isOpen,
}: {
  onClose: () => void
  isOpen: boolean,
}) => {
  const { data: session } = useSession()
  const { userInfo } = useTypedSelector((state) => state.profile)

  const TOKEN = session?.user?.access

  const [selectedMedia, setSelectedMedia] = useState<File[]>([])
  const [selectedMediaUrls, setSelectedMediaUrls] = useState<string[]>([])

  const createPostValidationSchema = yup.object().shape({
    description: yup.string().required('Description is required'),
  })

  const { mutate: createPost, isLoading: isCreatingPost } = useCreatePost()
  const queryClient = useQueryClient()

  const { data: hashtags } = useGetAllHashtags(TOKEN as string)
  const dropdownOfHashtags = hashtags?.results?.map((hashtag: any) => {
    return {
      value: hashtag?.id,
      label: hashtag?.hashtag,
    }
  })

  const {
    mutate: createHashtag,
    isLoading: isCreatingHashtag,
  } = useCreateHashtag()

  const [value, setValue] = useState<readonly Option[]>([])

  const handleCreate = (inputValue: string) => {
    createHashtag(
      {
        body: {
          hashtag: inputValue[0] !== '#' ? `#${inputValue}` : inputValue,
        },
        token: TOKEN as string,
      },
      { onSuccess: () => queryClient.invalidateQueries(['getAllHashtags']) },
    )
  }

  const formik = useFormik({
    initialValues: {
      description: '',
      hashtags: [],
    },
    validationSchema: createPostValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const initialBody: Record<string, any> = {
        body: values?.description,
      }

      const body = new FormData()

      for (let key in initialBody) {
        body.append(key, initialBody[key])
      }

      if (selectedMedia.length > 0) {
        for (let i = 0; i < selectedMedia.length; i++) {
          body.append(`media[${i}]`, selectedMedia[i])
        }
      }

      body.append('hashtags', JSON.stringify(values.hashtags))
      createPost(
        { token: TOKEN as string, body },
        {
          onSuccess: () => {
            notify({
              type: 'success',
              text: 'Post has been successfully created',
            })
            queryClient.invalidateQueries(['getMyPostsByType'])
            queryClient.invalidateQueries(['getNewsfeed'])
            queryClient.invalidateQueries(['getMyPosts'])
            resetForm({})
            setSelectedMedia([])
            setSelectedMediaUrls([])
            onClose()
          },
          onError: (err: any) =>
            notify({
              type: 'error',
              text: err?.body || err?.data?.body || err?.data?.message,
            }),
        },
      )
    },
  })

  useEffect(() => {
    if (value) {
      formik?.setFieldValue(
        'hashtags',
        value?.map((val: any) => val?.value),
      )
    }
    // eslint-disable-next-line
  }, [value])

  const [currImgIndex, setCurrImgIndex] = useState(0)
  const [deleteElement, setDeleteElement] = useState(false)
  const [isLessThan769] = useMediaQuery('(max-width: 768px)')

  const [showCreatable, setShowCreatable] = useState(false)

  useEffect(() => {
    if (deleteElement) {
      setSelectedMedia(
        selectedMedia?.filter((media) => media !== selectedMedia[currImgIndex]),
      )
      setSelectedMediaUrls(
        selectedMediaUrls?.filter(
          (url) => url !== selectedMediaUrls[currImgIndex],
        ),
      )
      setDeleteElement(false)
    }
  }, [deleteElement, selectedMedia, selectedMediaUrls])

  const handleDelete = (index: number) => {
    console.log(index)
    // Create a copy of the selectedMediaUrls array
    const updatedMediaUrls = [...selectedMediaUrls]
    // Remove the image URL at the specified index
    updatedMediaUrls.splice(index, 1)
    // Update the state with the new array
    setSelectedMediaUrls(updatedMediaUrls)
  }

  return (
    <>
      {isLessThan769 ? (
        <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
          <DrawerOverlay />

          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <DrawerContent fontFamily="PolySans">
                <DrawerHeader >
                  <Text fontSize="20px" fontWeight="500" color="#464646">
                    Create Post
                  </Text>
                </DrawerHeader>
                <DrawerBody overflowY="scroll" padding="12px 21px" mb={'20px'}>
                  <Flex align="center" justifyContent="space-between">
                    <Image
                      src={userInfo?.profile?.user?.image ?? ProfileImg}
                      alt="profile"
                      onError={handleOnError}
                      className="object-cover w-10 h-10 rounded-[50%]"
                    />
                    <div>
                      <p className="font-semibold text-[16px] leading-[24px] text-brand-2250">
                        Everyone
                      </p>
                    </div>
                  </Flex>

                  <Box mt="15px" mb="15px">
                    <div className="w-full ">
                      <TextBox
                        title=""
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        id="description"
                        placeholder="What are your thoughts"
                        withoutBorder
                      />
                    </div>
                    <ErrorMessage
                      name="description"
                      component="p"
                      className="text-brand-warning text-[12px] pb-[12px]"
                    />
                  </Box>
                  {selectedMediaUrls?.length > 0 ? (
                    <MediaSection
                      selectedMediaUrls={selectedMediaUrls}
                      currImgIndex={currImgIndex}
                      setCurrImgIndex={(index) => setCurrImgIndex(index)}
                      onDelete={(index) => handleDelete(index)}
                    />
                  ) : (
                    <Flex
                      w="full"
                      direction="column"
                      borderRadius="8px"
                      border="1px solid #f1f1f1"
                      justify="center"
                      align="center"
                      mb="29px"
                      py="30px"
                      cursor="pointer"
                      className="relative"
                      onClick={() =>
                        // console.log('dsfdsfs')
                        document.getElementById('media-file-input')?.click()
                      }
                    >
                      <Image src="/AddMediaIcon.svg" className='h-[30px]' alt="add-media" />
                      <Text
                        mt="15px"
                        fontSize="14px"
                        fontWeight="400"
                        color="#464646"
                      >
                        Add Media
                      </Text>
                      <Input
                        type="file"
                        accept="image/*,video/*"
                        width="100%"
                        height="100%"
                        pos="absolute"
                        className="invisible"
                        multiple
                        id="media-file-input"
                        onChange={(e) => {
                          const fileList = e.target.files
                          if (fileList) {
                            const fileSizesArray = Array.from(fileList)?.map(
                              (file: File) => file.size,
                            )
                            const totalFileSizes = fileSizesArray?.reduce(
                              (a: any, b: any) => a + b,
                            )

                            if (totalFileSizes < 10485760) {
                              setSelectedMedia([...Array.from(fileList)])
                              setSelectedMediaUrls(
                                Array.from(fileList)?.map((file: File) =>
                                  URL.createObjectURL(file),
                                ),
                              )
                            } else {
                              notify({
                                type: 'error',
                                text: 'Total media size should not exceed 10MB',
                              })
                            }
                          }
                        }}
                      />
                    </Flex>
                  )}
                  <div>
                    <Text
                      mb="16px"
                      color="#525252"
                      fontSize="16px"
                    >
                      Where should this post trend?
                    </Text>

                    {showCreatable && (
                      <CreatableSelect
                        isClearable
                        isMulti
                        isDisabled={isCreatingHashtag}
                        isLoading={isCreatingHashtag}
                        onChange={(newValue) => setValue(newValue)}
                        onCreateOption={handleCreate}
                        options={dropdownOfHashtags}
                        value={value}
                        className="creatable-select-talstrike"
                        placeholder=""
                        autoFocus={false}
                        menuPlacement={'top'}
                      />
                    )}

                    <Text
                      fontSize="14px"
                      mt={'16px'}
                      color="#494949"
                      onClick={() => setShowCreatable(true)}
                    >
                      Add tags
                    </Text>
                  </div>
                </DrawerBody>
                <DrawerFooter
                  display="flex"
                  justifyContent="space-between"
                  borderTop="1px solid #CDCDCD"
                >
                  <Flex gap="18px">
                    <Flex gap="4px" alignItems="center">
                      <Image src="/CreatePostMediaIcon.svg" alt=" " />
                      <Text fontSize="14px" fontWeight="400" color="#525252">
                        Media
                      </Text>
                    </Flex>
                    <Flex gap="4px" alignItems="center">
                      <Image src="/CreatePostTakeAShotIcon.svg" alt=" " />
                      <Text fontSize="14px" fontWeight="400" color="#525252">
                        Take a shot
                      </Text>
                    </Flex>
                  </Flex>
                  <Button
                    h="35px"
                    w="95px"
                    bg="#2942FF"
                    color="#fff"
                    fontWeight="400"
                    onClick={() => formik.handleSubmit()}
                    disabled={formik.values.description?.length === 0}
                    isLoading={isCreatingPost}
                  >
                    Publish
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </form>
          </FormikProvider>
        </Drawer>
      ) : (
        <Modal isOpen={isOpen} size={"xl"} onClose={onClose} isCentered>
          <ModalOverlay />

          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <ModalContent

                fontFamily="PolySans"
              >
                <ModalHeader>
                  <Text fontSize="20px" fontWeight="400" color="#293137">
                    Create Post
                  </Text>
                  <ModalCloseButton bg="unset" />
                </ModalHeader>
                <ModalBody p="23px 26px" overflowY="scroll">
                  <Flex justifyContent="space-between" align="center">
                    <Image
                      src={userInfo?.profile?.user?.image ?? ProfileImg}
                      alt="profile"
                      borderRadius="56px"
                      className="h-10"
                      onError={handleOnError}
                    />
                    <div>
                      <p className="font-semibold text-[16px] leading-[24px] text-brand-2250">
                        Everyone
                      </p>
                    </div>
                  </Flex>

                  <Box mt="29.83px">
                    <Box>
                      <div className="w-full">
                        <TextBox
                          title=""
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.description}
                          id="description"
                          placeholder="Express your thoughts"
                          withoutBorder
                        />
                      </div>
                      <ErrorMessage
                        name="description"
                        component="p"
                        className="text-brand-warning text-[12px] pb-[12px]"
                      />
                    </Box>
                  </Box>

                  {selectedMediaUrls?.length > 0 ? (
                    <Flex w="full" h="347px" pos="relative" cursor="pointer">
                      {currImgIndex > 0 && (
                        <Flex
                          h="full"
                          align="center"
                          pos="absolute"
                          left="0"
                          onClick={() => setCurrImgIndex(currImgIndex - 1)}
                        >
                          <Flex
                            w="40px"
                            bg="#f1f1f1"
                            h="100px"
                            align="center"
                            justify="center"
                          >
                            <ArrowSmallLeftIcon width="20px" height="20px" />
                          </Flex>
                        </Flex>
                      )}
                      {selectedMediaUrls?.map((mediaUrl, index) => (
                        <Flex
                          w="full"
                          h="full"
                          display={
                            currImgIndex === index ? 'inline-flex' : 'none'
                          }
                          pos="relative"
                          key={index}
                        >
                          <Box
                            pos="absolute"
                            top="14px"
                            right="15px"
                            onClick={() => setDeleteElement(true)}
                          >
                            <DeleteMediaIcon />
                          </Box>
                          <Image
                            w="full"
                            h="full"
                            src={mediaUrl}
                            objectFit="cover"
                            alt="new media"
                          />
                        </Flex>
                      ))}
                      {currImgIndex < selectedMediaUrls?.length - 1 && (
                        <Flex
                          h="full"
                          align="center"
                          pos="absolute"
                          right="0"
                          cursor="pointer"
                        >
                          <Flex
                            w="40px"
                            bg="#f1f1f1"
                            h="100px"
                            align="center"
                            justify="center"
                            onClick={() => setCurrImgIndex(currImgIndex + 1)}
                          >
                            <ArrowSmallRightIcon width="20px" height="20px" />
                          </Flex>
                        </Flex>
                      )}
                    </Flex>
                  ) : (
                    <Flex
                      w="full"
                      direction="column"
                      borderRadius="8px"
                      border="1px solid #f1f1f1"
                      justify="center"
                      align="center"
                      mb="29px"
                      py="30px"
                      cursor="pointer"
                      className="relative"
                      onClick={() =>
                        // console.log('dsfdsfs')
                        document.getElementById('media-file-input')?.click()
                      }
                    >
                      <Image src="/AddMediaIcon.svg" className='h-[30px]' alt="add-media" />
                      <Text
                        mt="15px"
                        fontSize="14px"
                        fontWeight="400"
                        color="#464646"
                      >
                        Add Media
                      </Text>
                      <Input
                        type="file"
                        accept="image/*,video/*"
                        width="100%"
                        height="100%"
                        pos="absolute"
                        className="invisible"
                        multiple
                        id="media-file-input"
                        onChange={(e) => {
                          const fileList = e.target.files
                          if (fileList) {
                            const fileSizesArray = Array.from(fileList)?.map(
                              (file: File) => file.size,
                            )
                            const totalFileSizes = fileSizesArray?.reduce(
                              (a: any, b: any) => a + b,
                            )

                            if (totalFileSizes < 10485760) {
                              setSelectedMedia([...Array.from(fileList)])
                              setSelectedMediaUrls(
                                Array.from(fileList)?.map((file: File) =>
                                  URL.createObjectURL(file),
                                ),
                              )
                            } else {
                              notify({
                                type: 'error',
                                text: 'Total media size should not exceed 10MB',
                              })
                            }
                          }
                        }}
                      />
                    </Flex>

                  )}
                  <div>
                    <Text
                      mb="16px"
                      color="#525252"
                      fontSize="16px"
                    >
                      Where should this post trend?
                    </Text>

                    {showCreatable && (
                      <CreatableSelect
                        isClearable
                        isMulti
                        isDisabled={isCreatingHashtag}
                        isLoading={isCreatingHashtag}
                        onChange={(newValue) => setValue(newValue)}
                        onCreateOption={handleCreate}
                        options={dropdownOfHashtags}
                        value={value}
                        className="creatable-select-talstrike"
                        placeholder=""
                        autoFocus={false}
                        menuPlacement={'top'}
                      />
                    )}

                    <Text
                      fontSize="14px"
                      mt={'16px'}
                      color="#494949"
                      onClick={() => setShowCreatable(true)}
                    >
                      Add tags
                    </Text>
                  </div>

                </ModalBody>

                <ModalFooter
                  borderTop="1px solid #f1f1f1"
                  display="flex"
                  justifyContent="space-between"
                >
                  <Flex gap="18px">
                    <Flex gap="8px" alignItems="center" onClick={() =>
                      document.getElementById('media-file-input')?.click()
                    }>
                      <Image src="/CreatePostMediaIcon.svg" alt=" " />
                      <Text fontSize="14px" fontWeight="400" color="#525252">
                        Media
                      </Text>
                    </Flex>
                    <Flex gap="8px" alignItems="center">
                      <Image src="/CreatePostTakeAShotIcon.svg" alt=" " />
                      <Text fontSize="14px" fontWeight="400" color="#525252">
                        Media
                      </Text>
                    </Flex>
                  </Flex>
                  <Button
                    h="35px"
                    w="95px"
                    bg="#2942FF"
                    color="#fff"
                    fontWeight="400"
                    onClick={() => formik.handleSubmit()}
                    disabled={formik.values.description?.length === 0}
                    isLoading={isCreatingPost}
                  >
                    Publish
                  </Button>
                </ModalFooter>
              </ModalContent>
            </form>
          </FormikProvider>
        </Modal>
      )}
    </>
  )
}

export default CreatePost
