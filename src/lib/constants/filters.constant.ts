export type Filters = {
  keyword?: string;
  study_type?: string;
  date?: string;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
  doctor_id?: string;
};

export type FiltersProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  filterRole?: string;
  setFilterRole?: (v: string) => void;
  filterDate?: string;
  setFilterDate?: (v: string) => void;
  sortDate: "newest" | "oldest";
  setSortDate: (v: "newest" | "oldest") => void;
  created_date?: string;
  setCreatedDate?: (v: string) => void;
};