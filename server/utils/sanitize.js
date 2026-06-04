export const publicBuyer = (buyer) => {
  if (!buyer) return null
  const { passwordHash, password, ...safeBuyer } = buyer
  return safeBuyer
}

export const publicSeller = (seller) => {
  if (!seller) return null
  const { passwordHash, password, ...safeSeller } = seller
  return safeSeller
}

export const currentUserPayload = (account, type) => ({
  id: account.id,
  name: type === 'seller' ? account.businessName : account.name,
  type
})
