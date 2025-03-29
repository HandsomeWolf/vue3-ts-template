// api/user.ts
import { get, post } from '@/utils/request'

export function getUserInfo(id: string) {
  return get<UserInfo>('/user/info', { id })
}

export function updateUserProfile(data: UserProfile) {
  return post<boolean>('/user/profile', data)
}
