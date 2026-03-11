export class MatchingTripDto {
  city: string;
  country: string;
  startDate: string;
  endDate: string;
}

export class DiscoverResultDto {
  id: number;
  name: string;
  bio: string;
  travelStyle: string;
  interests: string[];
  languages: string[];
  profilePhoto: string | null;
  matchingTrip: MatchingTripDto;
  interestStatus: 'pending' | 'accepted' | 'rejected' | null;
}
